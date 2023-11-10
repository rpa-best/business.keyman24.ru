'use client';

import React from 'react';

import FiltersSvg from './svg/filters.svg';
import ResetSvg from './svg/refresh.svg';
import { InputFiltersWrapper } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper';
import { IOrganization } from 'store/types';
import { SelectInterval } from 'app/(Main)/components/FiltersContainer/components/SelectInterval';
import { usePathname, useRouter } from 'next/navigation';
import { DatePicker } from 'app/(Main)/components/FiltersContainer/components/DatePicker';

import scss from './FilterContainer.module.scss';
import {
    QueryIntervalType,
    QueryModeType,
} from 'app/(Main)/components/LineChart/LineChart';

interface FiltersContainerProps {
    org: IOrganization;
    contractors: IOrganization[];
    interval: QueryIntervalType;
    handleChangeQuery: (m?: QueryModeType, i?: QueryIntervalType) => void;
}

export const FiltersContainer: React.FC<FiltersContainerProps> = ({
    org,
    contractors,
    interval,
    handleChangeQuery,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleReset = () => {
        router.replace(pathname, { scroll: false });
    };

    return (
        <>
            <div className={scss.filter_title_wrapper_phone}>
                <FiltersSvg />
                <h2>Настройки посещений организации</h2>
            </div>
            <div className={scss.filter_layout}>
                <div className={scss.filter}>
                    <div className={scss.filter_header_wrapper}>
                        <div className={scss.filter_title_wrapper}>
                            <FiltersSvg />
                            <h2>Настройки посещений организации</h2>
                        </div>
                        <div
                            tabIndex={0}
                            onClick={() => handleReset()}
                            className={scss.filter_reset}
                        >
                            <ResetSvg />
                            <p>Сбросить</p>
                        </div>
                    </div>
                    <InputFiltersWrapper
                        handleChangeQuery={handleChangeQuery}
                        contractors={contractors}
                        defaultOrg={org}
                    />
                    <div className={scss.time_filters}>
                        <SelectInterval
                            interval={interval}
                            handleChangeQuery={handleChangeQuery}
                        />
                        <DatePicker />
                    </div>
                    <div
                        tabIndex={0}
                        onClick={() => handleReset()}
                        className={scss.filter_reset_phone}
                    >
                        <ResetSvg />
                        <p>Сбросить</p>
                    </div>
                </div>
            </div>
        </>
    );
};
