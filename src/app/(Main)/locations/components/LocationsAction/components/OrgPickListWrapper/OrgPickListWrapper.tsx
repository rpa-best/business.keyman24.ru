'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import {
    createLocationOrganization,
    deleteLocationOrganization,
    getLocationOrganizationsOnClient,
} from 'http/locationsApi';
import { DefaultElem } from 'components/PickList/types';
import { v4 } from 'uuid';
import {
    IModifiedOrganization,
    OrgPickListProps,
} from 'app/(Main)/locations/components/LocationsAction/components/types';
import { IOrganization } from 'store/types';
import { ILocationOrgResponse } from 'http/types';

export const OrgPickListWrapper: React.FC<OrgPickListProps> = ({
    organizations,
    setListsRefresh,
    locId,
    loading,
    setLoading,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [source, setSource] = useState<IModifiedOrganization[]>([]);
    const [target, setTarget] = useState<ILocationOrgResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const locationOrganizations =
                await getLocationOrganizationsOnClient(locId);

            const source = organizations.map((org) => {
                const orgInLocation = locationOrganizations.results.find(
                    (o) => o.toOrg.id === org.id
                );
                if (orgInLocation) {
                    return;
                }
                return { ...org, uuid: v4(), customDesc: `ИНН: ${org.inn}` };
            });

            const target =
                locationOrganizations.results.length !== 0
                    ? locationOrganizations.results.map((org) => {
                          const orgInn = organizations.find(
                              (o) => o.id === org.toOrg.id
                          )?.inn;
                          return {
                              ...org,
                              name: org.toOrg.name,
                              customDesc: `ИНН: ${orgInn}`,
                          };
                      })
                    : [];

            return { source, target };
        };
        fetchData()
            .then(({ source, target }) => {
                setSource(source as []);
                setTarget(target);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [organizations, locId, refresh]);

    const handleArrowRight = async (elems: DefaultElem[]) => {
        const res = await Promise.all(
            elems.map(async (el) => {
                return await createLocationOrganization({
                    to_org: +el.id,
                    location: locId,
                });
            })
        );
        setListsRefresh((v) => !v);
        return res;
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await deleteLocationOrganization(locId, +el.id);
            })
        ).then(() => {
            setListsRefresh((v) => !v);
        });
    };

    return (
        <>
            <PickList
                setLoading={setLoading}
                loading={loading}
                setRefresh={setRefresh}
                hidden
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
                available={source as any}
                selected={target as any}
                title="Настройки организации"
            />
        </>
    );
};
