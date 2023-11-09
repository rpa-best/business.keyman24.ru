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
        query: string;
    }>({ id: -1, name: '', query: '' });

    useEffect(() => {
        const mode = query.get('mode') ?? 'uniqueCount';
        const currentMode = FilterData.find((el) => el.query === mode);
        setSelectedMode(currentMode as typeof selectedMode);
    }, [query]);

    const handleDeleteOne = (id: number) => {
        setSelectedMode(FilterData[0]);
        searchHelper.getParams.delete('mode');
        router.replace(pathname + `?${searchHelper.getParams}`, {
            scroll: false,
        });
    };

    const handleChangeMode = (v: typeof selectedMode) => {
        setSelectedMode(v);
        searchHelper.set('mode', FilterData[v.id].query);
        router.replace(pathname + `?${searchHelper.getParams}`, {
            scroll: false,
        });
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
