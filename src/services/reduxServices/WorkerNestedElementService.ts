import { AxiosResponse } from 'axios';
import $api from '../../http';
import { IWorker } from '../../models/worker';

interface FetchProps {
    orgId: number
}

interface FetchByIdProps extends FetchProps {
    workerId: number
}

interface FetchByNameProps extends FetchProps {
    name: string
}

export default class WorkerNestedElementService {
    static async fetch(params: FetchProps, signal: AbortSignal): Promise<AxiosResponse<IWorker[]>> {
        return $api.get<IWorker[]>(`business/${params.orgId}/worker/`, { signal });
    }

    static async fetchById(params: FetchByIdProps, signal: AbortSignal): Promise<AxiosResponse<IWorker>> {
        return $api.get<IWorker>(`business/${params.orgId}/worker/${params.workerId}/`, { signal });
    }

    static async fetchByName(params: FetchByNameProps, signal: AbortSignal): Promise<AxiosResponse<IWorker[]>> {
        return $api.get<IWorker[]>(`business/${params.orgId}/worker/?name=${params.name}`, { signal })
    }
}
