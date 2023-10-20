import React from 'react';
import { ILocation } from 'http/types';

import { LocationListItem } from 'app/(Main)/inventory/components/SelectLocationTippy/LocationsList/LocationListItem';

import scss from 'app/(Main)/inventory/components/SelectLocationTippy/SelectLocationInput.module.scss';
interface LocationsListProps {
    locations: { id: number; name: string }[];
    deleteOne: (v: number) => void;
}

export const LocationsList: React.FC<LocationsListProps> = ({
    locations,
    deleteOne,
}) => {
    if (locations.length === 0) {
        return null;
    }
    return (
        <div className={scss.locations}>
            {locations.map((loc, index) => (
                <LocationListItem
                    deleteOne={deleteOne}
                    key={index}
                    location={loc}
                />
            ))}
        </div>
    );
};
