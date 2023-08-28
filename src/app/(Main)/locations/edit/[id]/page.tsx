import React from 'react';

import { LocationInfoWrapper } from 'app/(Main)/locations/components/LocationInfoWrapper';
import { cookies } from 'next/headers';
import { getLocation } from 'http/locationsApi';
import { LocationEditPage } from 'app/(Main)/locations/edit/[id]/types';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from './location.module.scss';

const LocationEditPage: React.FC<LocationEditPage> = async ({
    params: { id },
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const location = await getLocation(+orgId, +id);

    return (
        <div className={scss.children}>
            <div className={scss.button_wrapper}>
                <BackButton>Назад</BackButton>
            </div>
            <LocationInfoWrapper type="edit" location={location} />
        </div>
    );
};

export default LocationEditPage;
