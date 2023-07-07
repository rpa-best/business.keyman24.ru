import { AxiosResponse } from 'axios';
import $api from '../../http';
import { IOrganization } from '../../models/organization';

export default class OrganizationService {
    static async fetch(signal: AbortSignal): Promise<AxiosResponse<IOrganization[]>> {
        return $api.get<IOrganization[]>('business/orgs/', { signal });
    }

    static async fetchById(id: number, signal: AbortSignal): Promise<AxiosResponse<IOrganization>> {
        return $api.get<IOrganization>(`business/orgs/${id}/`, { signal });
    }

    static async fetchByName(name: string, signal: AbortSignal): Promise<AxiosResponse<IOrganization[]>> {
        return $api.get<IOrganization[]>(`business/orgs/?name=${name}`, { signal })
    }
}
