import React from 'react';

import { LocationInfoWrapper } from 'app/(Main)/locations/components/LocationInfoWrapper';
import { cookies } from 'next/headers';
import { getLocation } from 'http/locationsApi';
import { LocationEditPage } from 'app/(Main)/locations/edit/[id]/types';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { getOrganizationContractors } from 'http/organizationApi';
import { PickListsWrapper } from 'app/(Main)/locations/edit/components/PickListsWrapper';

import scss from './location.module.scss';

const LocationEditPage: React.FC<LocationEditPage> = async ({
    params: { id },
}) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const location = await getLocation(+orgId, +id);

    const organizations = await getOrganizationContractors(+orgId);

    return (
        <div className={scss.children_with_table}>
            <div className={scss.card_info_children}>
                <div className={scss.button_wrapper}>
                    <BackButton skipWord>Назад</BackButton>
                </div>
                <LocationInfoWrapper type="edit" location={location} />
            </div>
            <PickListsWrapper organizations={organizations} />
        </div>
    );
};

export default LocationEditPage;
