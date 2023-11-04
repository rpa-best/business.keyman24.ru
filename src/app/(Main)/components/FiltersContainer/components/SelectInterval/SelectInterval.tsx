'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { ButtonsData } from 'app/(Main)/components/FiltersContainer/components/SelectInterval/buttonsData';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { useResizeWidth } from 'hooks/useResizeWidth';
import { InputSelect } from 'components/UI/Inputs/InputSelect';

import scss from './SelectInterval.module.scss';

export const SelectInterval = () => {
    const query = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const queryHelper = new SearchParamsHelper(query.entries);

    const { tabletBreak } = useResizeWidth();

    const currentQuery = query.get('by') ?? 'hour';

    const currentInputQuery = useMemo(() => {
        return ButtonsData.find((el) => {
            return el.query === currentQuery;
        });
    }, [currentQuery]);

    const inputSelectData = useMemo(() => {
        return ButtonsData.map((el) => ({ name: el.text, id: el.id }));
    }, []);

    const handleSelectIntervalChange = (id: number) => {
        const selectedInterval = ButtonsData.find((el) => el.id === id);
        queryHelper.set('by', selectedInterval?.query as string);
        router.replace(pathname + `?${queryHelper.getParams}`);
    };

    return (
        <div className={scss.intervals_buttons}>
            {!tabletBreak ? (
                ButtonsData.map((el, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            queryHelper.set('by', el.query);
                            router.replace(
                                pathname + `?${queryHelper.getParams}`
                            );
                        }}
                        className={
                            currentQuery === el.query
                                ? scss.button_active
                                : scss.button
                        }
                    >
                        {el.text}
                    </button>
                ))
            ) : (
                <InputSelect
                    rounded
                    needErrorLabel={false}
                    name="select-interval"
                    value={currentInputQuery?.text as string}
                    onChange={(v) => handleSelectIntervalChange(v.id)}
                    listValues={inputSelectData}
                />
            )}
        </div>
    );
};
