import React from 'react';
import { cookies } from 'next/headers';

import { getLocation, getLocationObjects } from 'http/locationsApi';

import { BackButton } from 'components/UI/Buttons/BackButton';
import { ObjectsTableWrapper } from 'app/(Main)/locations/[locId]/objects/components/ObjectsTableWrapper';

import scss from 'app/(Main)/locations/locations.module.scss';

interface LocationObjectsPageProps {
    params: { locId: string };
    searchParams: { offset: string };
}

const LocationObjectsPage: React.FC<LocationObjectsPageProps> = async ({
    params: { locId },
    searchParams,
}) => {
    const cookieStore = cookies();

    const offset = searchParams.offset ?? '0';

    const orgId = cookieStore.get('orgId')?.value as string;

    const objects = await getLocationObjects(+orgId, +locId, offset);

    const modifiedObjects = objects.results.map((l) => {
        return { ...l, desc: l.desc ?? '-' };
    });

    const location = await getLocation(+orgId, +locId);

    const locationName = location.name;

    return (
        <div className={scss.children_with_table}>
            <div className={scss.button_wrapper}>
                <BackButton skipNumber skipWord>
                    Назад
                </BackButton>
            </div>
            <h2 className={scss.page_title_with_table}>
                Объекты на локации: {locationName}
            </h2>
            <ObjectsTableWrapper
                count={objects.count}
                permissions={objects.permissions}
                locId={+locId}
                modifiedObjects={modifiedObjects}
            />
        </div>
    );
};

export default LocationObjectsPage;
