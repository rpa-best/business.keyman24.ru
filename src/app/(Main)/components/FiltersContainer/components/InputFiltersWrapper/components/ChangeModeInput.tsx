import { FilterData } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/data';
import { ColorRadialInputSelect } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect';
import React, { useEffect, useState } from 'react';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QueryModeType } from 'app/(Main)/components/LineChart/LineChart';
import { IOrganization } from 'store/types';

interface ChangeModeInputProps {
    setMode: (m: QueryModeType[]) => void;
}

export const ChangeModeInput: React.FC<ChangeModeInputProps> = ({
    setMode,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const query = useSearchParams();
    const searchHelper = new SearchParamsHelper(query.entries);

    const [selectedMode, setSelectedMode] = useState<FilterData>(FilterData[0]);
    const [selectedMods, setSelectedModes] = useState<FilterData[]>([
        FilterData[0],
    ]);

    useEffect(() => {
        const mods = query.get('mode') ?? FilterData[0].query;
        const newMods = mods.split(',');
        setSelectedMode(
            FilterData.find((el) => el.query === newMods.at(-1)) as FilterData
        );
        setSelectedModes(
            FilterData.filter((el) => newMods.some((nm) => nm === el.query))
        );
    }, [query]);

    const handleDeleteOne = (id: number) => {
        if (selectedMods.length === 1) {
            setSelectedMode(FilterData[0]);
            setSelectedModes([FilterData[0]]);

            setMode([FilterData[0].query as QueryModeType]);

            searchHelper.set('mode', FilterData[0].query);
            router.replace(pathname + `?${searchHelper.getParams}`, {
                scroll: false,
            });
            return;
        }
        const copyArray = selectedMods;
        const newMods = copyArray.filter((el) => el.id !== id);
        const modsQueries = newMods.map((el) => el.query).join(',');

        searchHelper.set('mode', modsQueries);
        router.replace(pathname + `?${searchHelper.getParams}`, {
            scroll: false,
        });

        setMode(modsQueries.split(',') as QueryModeType[]);
        setSelectedModes(selectedMods.filter((el) => el.id !== id));
        setSelectedMode(newMods.at(-1) as any);
    };
    const handleChangeMode = (v: typeof selectedMode) => {
        const newMods = [...selectedMods, v];
        const modsQuery = newMods.map((el) => el.query).join(',');

        searchHelper.set('mode', modsQuery);
        router.replace(pathname + `?${searchHelper.getParams}`, {
            scroll: false,
        });

        const queryMods = newMods.map((el) => el.query);

        setSelectedMode(v);
        setSelectedModes(newMods);
        setMode(queryMods as QueryModeType[]);
    };

    return (
        <ColorRadialInputSelect
            bgColor="#4E6A9E"
            placeholder="Фильтр по посещениям"
            selectedValues={selectedMods}
            handleDeleteOne={handleDeleteOne}
            showPrevValue={true}
            value={selectedMode.name}
            listValues={FilterData}
            onChange={(v) => handleChangeMode(v)}
        />
    );
};
