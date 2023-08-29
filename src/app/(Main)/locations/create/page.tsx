import React from 'react';

import { LocationInfoWrapper } from 'app/(Main)/locations/components/LocationInfoWrapper';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from 'app/(Main)/locations/create/location.module.scss';

const LocationCreatePage = async () => {
    return (
        <div className={scss.children}>
            <div className={scss.button_wrapper}>
                <BackButton>Назад</BackButton>
            </div>
            <LocationInfoWrapper type="create" />
        </div>
    );
};

export default LocationCreatePage;
