import React from 'react';

import { LocationInfoWrapper } from 'app/(Main)/locations/components/LocationInfoWrapper';
import { cookies } from 'next/headers';
import {
    getLocation,
    getLocationOrganizations,
    getLocationWorkers,
} from 'http/locationsApi';
import {
    LocationEditPage,
    ModifiedWorker,
} from 'app/(Main)/locations/edit/[id]/types';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { OrgPickListWrapper } from 'app/(Main)/locations/components/OrgPickListWrapper';
import {
    getOrganizationContractors,
    getOrganizations,
} from 'http/organizationApi';

import scss from './location.module.scss';
import { getServerWorkers } from 'http/workerApi';
import { WorkersPickListWrapper } from 'app/(Main)/locations/components/WorkersPickListWrapper';
import { v4 } from 'uuid';
import { PickListsWrapper } from 'app/(Main)/locations/edit/components/PickListsWrapper';

const LocationEditPage: React.FC<LocationEditPage> = async ({
    params: { id },
}) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const location = await getLocation(+orgId, +id);

    const organizations = await getOrganizations();

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
