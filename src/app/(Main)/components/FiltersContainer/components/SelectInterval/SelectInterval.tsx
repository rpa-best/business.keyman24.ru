'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

import { ButtonsData } from 'app/(Main)/components/FiltersContainer/components/SelectInterval/buttonsData';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import {
    QueryIntervalType,
    QueryModeType,
} from 'app/(Main)/components/LineChart/LineChart';
import { InputSelect } from 'components/UI/Inputs/InputSelect';

import scss from './SelectInterval.module.scss';

interface SelectIntervalProps {
    interval: QueryIntervalType;
    handleChangeQuery: (m?: QueryModeType[], i?: QueryIntervalType) => void;
}

export const SelectInterval: React.FC<SelectIntervalProps> = ({
    interval,
    handleChangeQuery,
}) => {
    const query = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const queryHelper = new SearchParamsHelper(query.entries);

    const currentInputQuery = useMemo(() => {
        return ButtonsData.find((el) => {
            return el.query === interval;
        });
    }, [interval]);

    const inputSelectData = useMemo(() => {
        return ButtonsData.map((el) => ({ name: el.text, id: el.id }));
    }, []);

    const handleSelectIntervalChange = (id: number) => {
        const selectedInterval = ButtonsData.find((el) => el.id === id);
        handleChangeQuery(
            undefined,
            selectedInterval?.query as QueryIntervalType
        );
        queryHelper.set('interval', selectedInterval?.query as string);
        queryHelper.getParams.delete('date_gt');
        queryHelper.getParams.delete('date_lt');
        router.replace(pathname + `?${queryHelper.getParams}`, {
            scroll: false,
        });
    };

    return (
        <div className={scss.intervals_buttons}>
            <div className={scss.buttons}>
                {ButtonsData.map((el, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            handleSelectIntervalChange(el.id);
                        }}
                        className={
                            interval === el.query
                                ? scss.button_active
                                : scss.button
                        }
                    >
                        {el.text}
                    </button>
                ))}
            </div>
            <div className={scss.buttons_tablet}>
                <InputSelect
                    rounded
                    needErrorLabel={false}
                    name="select-interval"
                    value={currentInputQuery?.text as string}
                    onChange={(v) => handleSelectIntervalChange(v.id)}
                    listValues={inputSelectData}
                />
            </div>
        </div>
    );
};
