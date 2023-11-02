'use client';

import FiltersSvg from './svg/filters.svg';
import ResetSvg from './svg/refresh.svg';
import { InputFiltersWrapper } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper';

import scss from './FilterContainer.module.scss';
import { IOrganization } from 'store/types';
import React from 'react';

interface FiltersContainerProps {
    org: IOrganization;
    contractors: IOrganization[];
}

export const FiltersContainer: React.FC<FiltersContainerProps> = ({
    org,
    contractors,
}) => {
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
                            onClick={() => {}}
                            className={scss.filter_reset}
                        >
                            <ResetSvg />
                            <p>Сбросить</p>
                        </div>
                    </div>
                    <InputFiltersWrapper
                        contractors={contractors}
                        defaultOrg={org}
                    />
                    <div
                        tabIndex={0}
                        onClick={() => {}}
                        className={scss.filter_phone}
                    >
                        <ResetSvg />
                        <p>Сбросить</p>
                    </div>
                </div>
            </div>
        </>
    );
};
