'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
    ModifiedLocOrgPickList,
    ModifiedOrganizationsPickList,
    OrgPickListProps,
} from 'app/(Main)/locations/edit/[id]/types';
import { PickList } from 'components/PickList';
import {
    createLocationOrganization,
    deleteLocationOrganization,
    getLocationOrganizationsOnClient,
} from 'http/locationsApi';
import { DefaultElem } from 'components/PickList/types';

export const OrgPickListWrapper: React.FC<OrgPickListProps> = ({
    organizations,
    setListsRefresh,
}) => {
    const params = useParams();

    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState<ModifiedOrganizationsPickList[]>([]);
    const [target, setTarget] = useState<ModifiedLocOrgPickList[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const locationOrganizations =
                await getLocationOrganizationsOnClient(+params.id);

            const source = organizations.map((org) => {
                const orgInLocation = locationOrganizations.results.find(
                    (o) => o.toOrg.id === org.id
                );
                if (orgInLocation) {
                    return;
                }
                return { ...org, customDesc: `ИНН: ${org.inn}` };
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
    }, [organizations, params.id, refresh]);

    const handleArrowRight = async (elems: DefaultElem[]) => {
        const res = await Promise.all(
            elems.map(async (el) => {
                return await createLocationOrganization({
                    to_org: +el.id,
                    location: +params.id,
                });
            })
        );
        setListsRefresh((v) => !v);
        return res;
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await deleteLocationOrganization(+params.id, +el.id);
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
                available={source as []}
                selected={target as []}
                title="Настройки организации"
            />
        </>
    );
};
