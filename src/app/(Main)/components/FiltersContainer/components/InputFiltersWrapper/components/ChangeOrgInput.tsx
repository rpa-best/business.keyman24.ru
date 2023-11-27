import { ColorRadialInputSelect } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IOrganization } from 'store/types';
import { getOrganizationContractorsOnClient } from 'http/organizationApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { ILocation } from 'http/types';

interface ChangeOrgInputProps {
    defaultOrg: IOrganization;
    contractors: IOrganization[];
    itsOrg?: boolean;
}

export const ChangeOrgInput: React.FC<ChangeOrgInputProps> = ({
    defaultOrg,
    contractors,
    itsOrg = true,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchHelper = new SearchParamsHelper(searchParams.entries);

    const [selectedOrgs, setSelectedOrgs] = useState<IOrganization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<IOrganization>({
        name: '',
    } as any);

    const orgListValues = useMemo(() => {
        return [...contractors];
    }, [contractors]);

    useEffect(() => {
        const org = itsOrg
            ? searchParams.get('org') ?? defaultOrg.id.toString()
            : searchParams.get('location') ?? defaultOrg.id.toString();
        const newSelected = contractors.filter((el) =>
            org.split(',').reverse().includes(el.id.toString())
        );
        setSelectedOrgs(newSelected);
        setSelectedOrg(newSelected.at(-1) as IOrganization);
    }, [itsOrg]);

    useEffect(() => {
        if (itsOrg) {
            if (!searchParams.get('org')) {
                setSelectedOrgs([defaultOrg]);
                setSelectedOrg(defaultOrg);
            }
        } else {
            if (!searchParams.get('location')) {
                setSelectedOrgs([defaultOrg]);
                setSelectedOrg(defaultOrg);
            }
        }
    }, [defaultOrg, searchParams]);

    const handleChangeOrgs = (v: IOrganization) => {
        const newOrgs = [...selectedOrgs, v];
        const orgsIds = newOrgs.map((el) => el.id.toString()).join(',');

        itsOrg
            ? searchHelper.set('org', orgsIds)
            : searchHelper.set('location', orgsIds);
        router.replace(pathname + `?${searchHelper.getParams}`, {
            scroll: false,
        });

        setSelectedOrgs(newOrgs);
        setSelectedOrg(v);
    };

    const handleDeleteOne = (id: number) => {
        if (selectedOrgs.length === 1) {
            setSelectedOrg(defaultOrg);
            setSelectedOrgs([defaultOrg]);

            itsOrg
                ? searchHelper.set('org', defaultOrg.id.toString())
                : searchHelper.set('location', defaultOrg.id.toString());
            router.replace(pathname + `?${searchHelper.getParams}`, {
                scroll: false,
            });
            return;
        }
        const copyArray = selectedOrgs;
        const newOrgs = copyArray.filter((el) => el.id !== id);
        const orgsIds = newOrgs.map((el) => el.id.toString()).join(',');

        itsOrg
            ? searchHelper.set('org', orgsIds)
            : searchHelper.set('location', orgsIds);
        router.replace(pathname + `?${searchHelper.getParams}`, {
            scroll: false,
        });

        setSelectedOrgs(selectedOrgs.filter((el) => el.id !== id));
        setSelectedOrg(newOrgs.at(-1) as IOrganization);
    };

    return (
        <ColorRadialInputSelect
            placeholder={
                itsOrg ? 'Фильтр по организации' : 'Фильтр по локациям'
            }
            selectedValues={selectedOrgs}
            handleDeleteOne={handleDeleteOne}
            showPrevValue={true}
            value={selectedOrg.name}
            listValues={orgListValues}
            onChange={(v) => handleChangeOrgs(v)}
        />
    );
};
