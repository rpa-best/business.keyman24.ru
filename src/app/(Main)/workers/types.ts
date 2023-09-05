import { ICard, IWorker, IWorkerDocs, IWorkerUser } from 'http/types';

export interface WorkerTableWrapperProps {
    workers: ModifiedWorkers;
}

interface NewWorkers extends Omit<IWorker, 'user' | 'org'> {
    user: string;
    org: string;
}

export interface ModifiedWorkers {
    results: NewWorkers[];
    count: number;
}

export interface IWorkerEditFormProps {
    worker: IWorker;
    workerUser: IWorkerUser;
}

export interface WorkerDocsTableProps {
    info: ICard[] | IWorkerDocs[];
}
