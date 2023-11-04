import { FilterData } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/data';
import { ColorRadialInputSelect } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect';
import React, { useEffect, useState } from 'react';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const ChangeModeInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const query = useSearchParams();

    const searchHelper = new SearchParamsHelper(query.entries);

    const [selectedMode, setSelectedMode] = useState<{
        id: number;
        name: string;
    }>({ id: -1, name: '' });

    useEffect(() => {
        const mode = query.get('mode');
        if (mode === 'true') {
            setSelectedMode(FilterData[1]);
        } else if (mode === 'false') {
            setSelectedMode(FilterData.at(-1) as any);
        } else {
            setSelectedMode(FilterData[0]);
        }
    }, []);

    useEffect(() => {
        if (!query.get('mode')) {
            setSelectedMode(FilterData[0]);
        }
    }, [query]);

    const handleDeleteOne = (id: number) => {
        setSelectedMode(FilterData[0]);
    };

    const handleChangeMode = (v: typeof selectedMode) => {
        setSelectedMode(v);
        switch (v.name) {
            case 'Входы': {
                searchHelper.set('mode', 'true');
                router.replace(pathname + `?${searchHelper.getParams}`);
                break;
            }
            case 'Выходы': {
                searchHelper.set('mode', 'false');
                router.replace(pathname + `?${searchHelper.getParams}`);
                break;
            }
            case 'Уникальные посещения': {
                searchHelper.getParams.delete('mode');
                router.replace(pathname + `?${searchHelper.getParams}`);
            }
        }
    };

    return (
        <ColorRadialInputSelect
            bgColor="#4E6A9E"
            placeholder="Фильтр по посещениям"
            handleDeleteOne={handleDeleteOne}
            showPrevValue={true}
            value={selectedMode.name}
            listValues={FilterData}
            onChange={(v) => handleChangeMode(v)}
        />
    );
};
