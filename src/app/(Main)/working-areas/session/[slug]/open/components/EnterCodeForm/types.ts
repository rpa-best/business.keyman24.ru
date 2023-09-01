import { IWorker } from 'http/types';

export interface EnterCodeFormValues {
    code: string;
}

export interface EnterCodeFormProps {
    areaId: number;
    sessionId: number;
    worker: IWorker;
}
