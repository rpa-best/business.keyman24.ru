import { AxiosResponse } from 'axios';
import $api from '../../http';
import { IBusinessUser, IBusinessUserCreate, IBusinessUserCreateRequest } from '../../models/user';

export default class UserService {
    static async fetch(signal: AbortSignal): Promise<AxiosResponse<IBusinessUser[]>> {
        //! remove this
        return $api.get<IBusinessUser[]>(`business/${Number(localStorage.getItem('currOrg'))}/user/`, { signal })
    }

    static async fetchById(id: number, signal: AbortSignal): Promise<AxiosResponse<IBusinessUser>> {
        //! remove this
        return $api.get<IBusinessUser>(`business/${Number(localStorage.getItem('currOrg'))}/worker/${id}/user/`, { signal })
    }

    static async create(id: number, data: IBusinessUserCreateRequest, signal: AbortSignal): Promise<AxiosResponse<IBusinessUserCreate>> {
        //! remove this
        return $api.post<IBusinessUserCreate>(`business/${Number(localStorage.getItem('currOrg'))}/worker/${id}/user/`, data, { signal })
    }

    static async patch(id: number, data: any, signal: AbortSignal): Promise<AxiosResponse<IBusinessUser>> {
        //! remove this
        return $api.patch<IBusinessUser>(`business/${Number(localStorage.getItem('currOrg'))}/worker/${id}/user/`, data, { signal })
    }
}
