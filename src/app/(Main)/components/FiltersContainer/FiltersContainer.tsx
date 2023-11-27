'use client';

import React, { useState } from 'react';

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
import { ILocation } from 'http/types';

interface FiltersContainerProps {
    org: IOrganization;
    contractors: IOrganization[];
    interval: QueryIntervalType;
    handleChangeQuery: (m?: QueryModeType[], i?: QueryIntervalType) => void;
    locations: ILocation[];
}

export const FiltersContainer: React.FC<FiltersContainerProps> = ({
    org,
    contractors,
    interval,
    handleChangeQuery,
    locations,
}) => {
    const [refreshed, setRefreshed] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const handleReset = () => {
        router.replace(pathname, { scroll: false });
        setRefreshed(!refreshed);
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
                        refreshed={refreshed}
                        locations={locations}
                        handleChangeQuery={handleChangeQuery}
                        contractors={contractors}
                        defaultOrg={org}
                    />
                    <div className={scss.time_filters}>
                        <SelectInterval
                            interval={interval}
                            handleChangeQuery={handleChangeQuery}
                        />
                        <DatePicker currentInterval={interval} />
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
