import { ILocation } from 'http/types';
import React from 'react';
import ExitSvg from '/public/svg/x.svg';

import scss from 'app/(Main)/inventory/components/SelectLocationTippy/SelectLocationInput.module.scss';

interface LocationListItemProps {
    location: ILocation;
    deleteOne: (v: number) => void;
}

export const LocationListItem: React.FC<LocationListItemProps> = ({
    location,
    deleteOne,
}) => {
    return (
        <div className={scss.location_item}>
            <p className={scss.location_item_text}>{location.name}</p>
            <ExitSvg
                className={scss.delete_svg}
                onClick={() => deleteOne(location.id)}
            />
        </div>
    );
};
