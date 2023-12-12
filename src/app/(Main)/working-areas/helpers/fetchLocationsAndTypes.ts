import { getLocationsOnClient } from 'http/locationsApi';
import { getWorkingAreaTypesOnClient } from 'http/workingAreaApi';

export const fetchLocationsAndTypes = async () => {
    const locations = await getLocationsOnClient();
    const workingAreaTypes = await getWorkingAreaTypesOnClient();

    return { locations, workingAreaTypes };
};
