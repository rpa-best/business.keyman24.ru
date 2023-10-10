import { ICard, IWorker, IWorkerDocs, IWorkerUser } from 'http/types';

export interface WorkerTableWrapperProps {
    workers: ModifiedWorkers;
}

export interface NewWorkers extends Omit<IWorker, 'user' | 'org'> {
    user: string;
    org: string;
}

export interface ModifiedWorkers {
    results: NewWorkers[];
    count: number;
}

export interface IWorkerEditFormProps {
    worker: IWorker;
    workerUser: IWorkerUser | null;
    onUserSubmit: (phone: string, username: string) => void;
}

export interface WorkerDocsTableProps {
    info: ICard[] | IWorkerDocs[];
}
