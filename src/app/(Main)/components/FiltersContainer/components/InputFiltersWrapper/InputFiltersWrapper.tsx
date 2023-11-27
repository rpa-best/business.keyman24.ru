import React, { useEffect, useState } from 'react';

import { ChangeOrgInput } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/components/ChangeOrgInput';
import { ChangeModeInput } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/components/ChangeModeInput';

import { IOrganization } from 'store/types';

import { QueryModeType } from 'app/(Main)/components/LineChart/LineChart';
import { InputCheckbox } from 'components/UI/Inputs/InputCheckbox';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { ILocation } from 'http/types';

import scss from 'app/(Main)/components/FiltersContainer/FilterContainer.module.scss';

interface InputFiltersWrapperProps {
    defaultOrg: IOrganization;
    contractors: IOrganization[];
    handleChangeQuery: (m?: QueryModeType[]) => void;
    locations: ILocation[];
    refreshed: boolean;
}

export const InputFiltersWrapper: React.FC<InputFiltersWrapperProps> = ({
    defaultOrg,
    contractors,
    handleChangeQuery,
    refreshed,
    locations,
}) => {
    const [checked, setChecked] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const query = useSearchParams();
    const queryHelper = new SearchParamsHelper(query.entries);

    const location = query.get('location');

    const org = query.get('org');

    const handleChangeInput = (check: boolean) => {
        setChecked(check);
        if (check) {
            queryHelper.delete('org');
            queryHelper.set('location', locations[0].id.toString());
        } else {
            queryHelper.delete('location');
            queryHelper.set('org', defaultOrg.id.toString());
        }
        router.replace(pathname + `?${queryHelper.getParams}`, {
            scroll: false,
        });
    };

    useEffect(() => {
        if (checked) {
            queryHelper.delete('org');
        } else {
            queryHelper.delete('location');
        }
        router.replace(pathname + `?${queryHelper.getParams}`, {
            scroll: false,
        });
    }, [location, org]);

    useEffect(() => {
        setChecked(false);
    }, [refreshed]);

    return (
        <div className={scss.filter_inputs}>
            <div className={scss.filter_wrapper}>
                <div
                    onClick={() => handleChangeInput(!checked)}
                    className={scss.checkbox_wrapper}
                >
                    <InputCheckbox
                        type="checkbox"
                        name="change-selected"
                        label=""
                        value={checked}
                        onChange={handleChangeInput}
                    />
                    <p>По локациям</p>
                </div>
                {checked ? (
                    <ChangeOrgInput
                        defaultOrg={locations[0] as any}
                        contractors={locations as any}
                        itsOrg={false}
                    />
                ) : (
                    <ChangeOrgInput
                        contractors={contractors}
                        defaultOrg={defaultOrg}
                    />
                )}
            </div>
            <div className={scss.filter_wrapper}>
                <ChangeModeInput setMode={handleChangeQuery} />
            </div>
        </div>
    );
};
