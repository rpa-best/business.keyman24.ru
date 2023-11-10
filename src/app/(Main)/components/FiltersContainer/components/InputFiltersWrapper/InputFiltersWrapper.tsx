import React, { useEffect, useState } from 'react';

import { ChangeOrgInput } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/components/ChangeOrgInput';
import { ChangeModeInput } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/components/ChangeModeInput';

import { IOrganization } from 'store/types';

import scss from 'app/(Main)/components/FiltersContainer/FilterContainer.module.scss';
import {
    QueryIntervalType,
    QueryModeType,
} from 'app/(Main)/components/LineChart/LineChart';

interface InputFiltersWrapperProps {
    defaultOrg: IOrganization;
    contractors: IOrganization[];
    handleChangeQuery: (m?: QueryModeType) => void;
}

export const InputFiltersWrapper: React.FC<InputFiltersWrapperProps> = ({
    defaultOrg,
    contractors,
    handleChangeQuery,
}) => {
    return (
        <div className={scss.filter_inputs}>
            <div className={scss.filter_wrapper}>
                <ChangeOrgInput
                    contractors={contractors}
                    defaultOrg={defaultOrg}
                />
            </div>
            <div className={scss.filter_wrapper}>
                <ChangeModeInput setMode={handleChangeQuery} />
            </div>
        </div>
    );
};
