import React from 'react';

import { AreasTableWrapper } from 'app/(Main)/working-areas/components/AreasTableWrapper';
import { getWorkingAreas } from 'http/workingAreaApi';
import { IModfiedWorkingArea } from 'app/(Main)/working-areas/types';
import { cookies } from 'next/headers';

import scss from './WorkingAreas.module.scss';

const WorkingAreasPage = async ({
    searchParams,
}: {
    searchParams: { offset: string };
}) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value as string;
    const offset = searchParams.offset ?? '0';

    const workingAreas = await getWorkingAreas(+orgId, offset);

    const modifiedWorkingAreas: IModfiedWorkingArea[] =
        workingAreas.results.map((area) => {
            return {
                ...area,
                locationName: area.location.name,
                typeName: area.type.name,
            };
        });

    return (
        <div className={scss.working_children}>
            <h2 className={scss.working_title}>Рабочее место / Список</h2>
            <AreasTableWrapper
                count={workingAreas.count}
                permissions={workingAreas.permissions}
                workingAreas={modifiedWorkingAreas}
            />
        </div>
    );
};

export default WorkingAreasPage;
