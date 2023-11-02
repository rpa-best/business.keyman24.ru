import { ColorRadialInputSelect } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IOrganization } from 'store/types';
import { getOrganizationContractorsOnClient } from 'http/organizationApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParamsHelper } from 'utils/searchParamsHelper';

interface ChangeOrgInputProps {
    defaultOrg: IOrganization;
    contractors: IOrganization[];
}

export const ChangeOrgInput: React.FC<ChangeOrgInputProps> = ({
    defaultOrg,
    contractors,
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
        const org = searchParams.get('org') ?? defaultOrg.id.toString();
        const newSelected = contractors.filter((el) =>
            org.split(',').reverse().includes(el.id.toString())
        );
        setSelectedOrgs(newSelected);
        setSelectedOrg(newSelected.at(-1) as IOrganization);
    }, []);

    const handleChangeOrgs = (v: IOrganization) => {
        const newOrgs = [...selectedOrgs, v];
        const orgsIds = newOrgs.map((el) => el.id.toString()).join(',');

        searchHelper.set('org', orgsIds);
        router.replace(pathname + `?${searchHelper.getParams}`);

        setSelectedOrgs([...selectedOrgs, v]);
        setSelectedOrg(v);
    };

    const handleDeleteOne = (id: number) => {
        if (selectedOrgs.length === 1) {
            setSelectedOrg(defaultOrg);
            setSelectedOrgs([defaultOrg]);

            searchHelper.set('org', defaultOrg.id.toString());
            router.replace(pathname + `?${searchHelper.getParams}`);
            return;
        }
        const copyArray = selectedOrgs;
        const newOrgs = copyArray.filter((el) => el.id !== id);
        const orgsIds = newOrgs.map((el) => el.id.toString()).join(',');

        searchHelper.set('org', orgsIds);
        router.replace(pathname + `?${searchHelper.getParams}`);

        setSelectedOrgs(selectedOrgs.filter((el) => el.id !== id));
        setSelectedOrg(newOrgs.at(-1) as IOrganization);
    };

    return (
        <ColorRadialInputSelect
            placeholder="Фильтр по организации"
            selectedValues={selectedOrgs}
            handleDeleteOne={handleDeleteOne}
            showPrevValue={true}
            value={selectedOrg.name}
            listValues={orgListValues}
            onChange={(v) => handleChangeOrgs(v)}
        />
    );
};
