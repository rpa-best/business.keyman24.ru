import React from 'react';

import { AreasTableWrapper } from 'app/(Main)/working-area/components/AreasTableWrapper';
import {
    getLocations,
    getWorkingAreas,
    getWorkingAreaTypes,
} from 'http/workingAreaApi';
import { IModfiedWorkingArea } from 'app/(Main)/working-area/types';

import scss from './WorkingArea.module.scss';
import { cookies } from 'next/headers';

const WorkingAreaPage = async () => {
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
                workingTypes={workingAreaTypes.results}
                workingAreas={modifiedWorkingAreas}
            />
        </div>
    );
};

export default WorkingAreaPage;
