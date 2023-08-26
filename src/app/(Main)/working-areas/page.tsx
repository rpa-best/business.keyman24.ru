import React from 'react';

import { AreasTableWrapper } from 'app/(Main)/working-areas/components/AreasTableWrapper';
import { getWorkingAreas, getWorkingAreaTypes } from 'http/workingAreaApi';
import { getLocations } from 'http/locationsApi';
import { IModfiedWorkingArea } from 'app/(Main)/working-areas/types';
import { cookies } from 'next/headers';

import scss from './WorkingAreas.module.scss';

const WorkingAreasPage = async () => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;
    const workingAreas = await getWorkingAreas(+orgId);

    const workingAreaTypes = await getWorkingAreaTypes(+orgId);

    const locations = await getLocations(+orgId);

    const modifiedWorkingAreas: IModfiedWorkingArea[] =
        workingAreas.results.map((area) => {
            return {
                ...area,
                location: area.location.name,
                type: area.type.name,
            };
        });

    return (
        <div className={scss.working_children}>
            <h2 className={scss.working_title}>Рабочее место / Список</h2>
            <AreasTableWrapper
                locations={locations.results}
                initialAreas={workingAreas.results}
                workingTypes={workingAreaTypes.results}
                workingAreas={modifiedWorkingAreas}
            />
        </div>
    );
};

export default WorkingAreasPage;
