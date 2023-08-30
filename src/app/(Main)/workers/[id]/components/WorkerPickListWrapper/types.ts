import { DefaultElem } from 'components/PickList/types';

export interface CustomDefaultElem extends DefaultElem {
    type: string;
}

export interface WorkerPickListPermissionsWrapper {
    workerUsername: string;
    target: CustomDefaultElem[];
    source: CustomDefaultElem[];
}

export interface WorkerPresetPermValues {
    workerUsername: string;
    target: DefaultElem[];
    source: DefaultElem[];
}
