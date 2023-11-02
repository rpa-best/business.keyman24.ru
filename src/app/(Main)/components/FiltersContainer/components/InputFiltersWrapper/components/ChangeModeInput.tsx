import { FilterData } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/data';
import { ColorRadialInputSelect } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect';
import React, { useState } from 'react';

export const ChangeModeInput = () => {
    const [selectedMode, setSelectedMode] = useState<{
        id: number;
        name: string;
    }>(FilterData[0]);

    return (
        <ColorRadialInputSelect
            showPrevValue={true}
            value={selectedMode.name}
            listValues={FilterData}
            onChange={(v) => setSelectedMode(v)}
        />
    );
};