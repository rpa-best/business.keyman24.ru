import { DefaultElem } from 'components/PickList/types';

export interface CustomDefaultElem extends DefaultElem {
    type: string;
}

export interface WorkerPickListPermissionsWrapper {
    workerUsername: string;
}

export interface WorkerPresetPermValues {
    workerUsername: string;
}
