import { WorkAreaValues } from 'app/(Main)/working-areas/components/EditWorkingArea/types';
import { getDevices, getWorkingAreaDevices } from 'http/deviceApi';

interface ErrorsType
    extends Partial<Omit<WorkAreaValues, 'type' | 'location'>> {
    type?: string;
    location?: string;
}

export const ValidateAddWorkingArea = (values: WorkAreaValues) => {
    const errors: ErrorsType = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values.type.name) {
        errors.type = 'Обязательное поле';
    }

    if (!values.location.name) {
        errors.location = 'Обязательное поле';
    }

    return errors;
};

export const fetchAreasData = async (id: number) => {
    const sourceDevices = await getDevices();

    const targetDevices = await getWorkingAreaDevices(id as number);

    const source = sourceDevices.results.map((device) => {
        return {
            ...device,
            name: `${device.name}`,
            customDesc: device.desc,
        };
    });

    const target = targetDevices.results.map((d) => {
        return {
            ...d,
            name: d.device.name,
            customDesc: d.device.desc,
        };
    });

    const filterSource = source.filter((src) => {
        const trgId = target?.find((t) => t.device.id === src.id);
        return !trgId;
    });

    return {
        src: filterSource,
        trg: target,
    };
};
