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
import { getOrganizations } from 'http/organizationApi';

import scss from './location.module.scss';
import { getServerWorkers } from 'http/workerApi';
import { WorkersPickListWrapper } from 'app/(Main)/locations/components/WorkersPickListWrapper';

const LocationEditPage: React.FC<LocationEditPage> = async ({
    params: { id },
}) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const location = await getLocation(+orgId, +id);

    const organizations = await getOrganizations();

    const locationOrganizations = await getLocationOrganizations(+orgId, +id);

    const modifiedOrganizations = organizations.map((org) => {
        if (locationOrganizations.results.find((o) => o.toOrg.id === org.id)) {
            return;
        }
        return { ...org, customDesc: `ИНН: ${org.inn}` };
    });

    const modifiedLocationOrganizations =
        locationOrganizations.results.length !== 0
            ? locationOrganizations.results.map((org) => {
                  const orgInn = organizations.find(
                      (o) => o.id === org.toOrg.id
                  )?.inn;
                  return {
                      ...org,
                      name: org.toOrg.name,
                      customDesc: `ИНН: ${orgInn}`,
                  };
              })
            : [];

    const workers = await getServerWorkers(+orgId);

    const locationWorkers = await getLocationWorkers(+orgId, +id);

    const modifiedWorkers = workers.results.filter((w) => {
        if (
            locationWorkers.results.find((worker) => worker.worker.id === w.id)
        ) {
            return false;
        }
        return true;
    });

    const modifiedLocationWorkers: ModifiedWorker[] =
        locationWorkers.results.map((w) => {
            return { ...w, name: w.worker.name };
        });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.card_info_children}>
                <div className={scss.button_wrapper}>
                    <BackButton skipWord>Назад</BackButton>
                </div>
                <LocationInfoWrapper type="edit" location={location} />
            </div>
            <OrgPickListWrapper
                source={modifiedOrganizations as []}
                target={modifiedLocationOrganizations}
            />
            <WorkersPickListWrapper
                source={modifiedWorkers}
                target={modifiedLocationWorkers}
            />
        </div>
    );
};

export default LocationEditPage;
