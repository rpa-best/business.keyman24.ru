import { ICard, IWorker, IWorkerDocs } from 'http/types';

export interface WorkerTableWrapperProps {
    workers: ModifiedWorkers;
}

interface NewWorkers extends Omit<IWorker, 'user'> {
    user: string;
}

export interface ModifiedWorkers {
    results: NewWorkers[];
    count: number;
}

export interface IWorkerEditFormProps {
    worker: IWorker;
}

export interface WorkerDocsTableProps {
    info: ICard[] | IWorkerDocs[];
}
