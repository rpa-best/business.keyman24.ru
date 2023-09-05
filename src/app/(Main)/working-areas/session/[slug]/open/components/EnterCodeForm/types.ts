import { IWorker } from 'http/types';

export interface EnterCodeFormValues {
    code: string;
}

export interface EnterCodeFormProps {
    type: 'inventory' | 'keys';
    areaId: number;
    sessionId: number;
    worker: IWorker;
}
