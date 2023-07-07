/* eslint-disable class-methods-use-this */
import { AxiosResponse } from 'axios'
import { useAppSelector } from '../hooks/useReduxHooks'
import $api from '../http'
import IQueryParams from '../models/IQueryParams'
import IService from '../models/IService'
import ISubListQueryParams from '../models/ISubListQueryParams'

export interface ApiServiceProps {
    endpoint: string
}

export default class ApiService<Model, CreateInput> implements IService {
    endpoint: string

    // currentOrg: number

    constructor(props: ApiServiceProps) {
        this.endpoint = props.endpoint
        //! remove this
        // this.currentOrg = Number(localStorage.getItem('currOrg'))
    }

    // eslint-disable-next-line class-methods-use-this
    // private getToken(): number {
    //     const { currentOrg } = useAppSelector(state => state.org);
    //     return currentOrg.id || 0
    // }

    async fetch(signal: AbortSignal): Promise<AxiosResponse> {
        //! remove this
        return $api.get<Model[]>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}?ordering=id`, { signal })
    }

    async fetchById(id: number, signal: AbortSignal): Promise<AxiosResponse<Model>> {
        //! remove this
        return $api.get<Model>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${id}/`, { signal })
    }

    async fetchWithParams(params: IQueryParams, signal: AbortSignal): Promise<AxiosResponse> {
        //! remove this
        const currentOrg = Number(localStorage.getItem('currOrg'))
        // const currentOrg = this.getToken()

        // if (params.filter === undefined && params.limit === undefined) {
        //     return $api.get<Model[]>(`business/${currentOrg}/${this.endpoint}?offset=${params.offset}&ordering=${params.orderBy}`, { signal })
        // }

        // if (params.filter !== undefined && params.limit === undefined) {
        //     return $api.get<Model[]>(`business/${currentOrg}/${this.endpoint}?offset=${params.offset}&ordering=${params.orderBy}&${params.filter}`, { signal })
        // }

        // if (params.filter === undefined && params.limit === undefined) {
        //     return $api.get<Model[]>(`business/${currentOrg}/${this.endpoint}?offset=${params.offset}&ordering=${params.orderBy}&${params.filter}`, { signal })
        // }

        return params.filter === undefined
            ? $api.get<Model[]>(`business/${currentOrg}/${this.endpoint}?offset=${params.offset}&ordering=${params.orderBy}`, { signal })
            : $api.get<Model[]>(`business/${currentOrg}/${this.endpoint}?offset=${params.offset}&ordering=${params.orderBy}&${params.filter}`, { signal })
    }

    async fetchByName(name: string, signal: AbortSignal): Promise<AxiosResponse> {
        //! remove this
        return $api.get<Model[]>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}?name=${name}`, { signal })
    }

    async create(data: CreateInput, signal: AbortSignal): Promise<AxiosResponse<Model>> {
        //! remove this
        return $api.post<Model>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}`, { ...data }, { signal })
    }

    async put(data: any, signal: AbortSignal): Promise<AxiosResponse<Model>> {
        //! remove this
        return $api.put<Model>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${data.id}/`, { ...data }, { signal })
    }

    async patch(data: any, signal: AbortSignal): Promise<AxiosResponse<Model>> {
        //! remove this
        return $api.patch<Model>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${data.id}/`, { ...data }, { signal })
    }

    async delete(id: number, signal: AbortSignal): Promise<AxiosResponse> {
        //! remove this
        return $api.delete(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${id}/`, { signal })
    }

    async head(signal: AbortSignal): Promise<AxiosResponse> {
        //! remove this
        return $api.head(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}`, { signal })
    }

    // nested entity

    async fetchWithParamsNested(params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse> {
        return params.filter === undefined
            ? $api.get<Model[]>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/?offset=${params.offset}&ordering=${params.orderBy}`, { signal })
            : $api.get<Model[]>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/?offset=${params.offset}&ordering=${params.orderBy}&${params.filter}`, { signal })
    }

    async fetchByIdNested(
        id: number,
        params: ISubListQueryParams,
        signal: AbortSignal,
    ): Promise<AxiosResponse> {
        return $api.get<Model>(`business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/${id}/`, { signal })
    }

    async createNested(
        data: CreateInput,
        params: ISubListQueryParams,
        signal: AbortSignal,
    ): Promise<AxiosResponse<Model>> {
        return $api.post<Model>(
            `business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/`,
            { ...data },
            { signal },
        )
    }

    async putNested(
        data: any,
        params: ISubListQueryParams,
        signal: AbortSignal,
    ): Promise<AxiosResponse<Model>> {
        return $api.put<Model>(
            `business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/${data.id}/`,
            { ...data },
            { signal },
        )
    }

    async patchNested(
        data: any,
        params: ISubListQueryParams,
        signal: AbortSignal,
    ): Promise<AxiosResponse<Model>> {
        return $api.patch<Model>(
            `business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/${data.id}/`,
            { ...data },
            { signal },
        )
    }

    async deleteNested(
        id: number,
        params: ISubListQueryParams,
        signal: AbortSignal,
    ): Promise<AxiosResponse> {
        return $api.delete(
            `business/${Number(localStorage.getItem('currOrg'))}/${this.endpoint}${params.id}/${params.endpoint}/${id}/`,
            { signal },
        )
    }

    // free endpoint

    // async fetchEndpointWithParams(params: ISubListQueryParams): Promise<AxiosResponse<any, any>> {
    //     return $api.get<Model[]>(
    //         `${params.endpoint}/?offset=${params.offset}&ordering=${params.orderBy}`,
    //     )
    // }

    // async fetchEndpointById(id: number, params: ISubListQueryParams): Promise<AxiosResponse<any, any>> {
    //     return $api.get<Model>(`${params.endpoint}/${id}/`)
    // }

    // async createEndpoint(params: ISubListQueryParams): Promise<AxiosResponse<any, any>> {
    //     return $api.post<Model>(`${params.endpoint}/`, { ...params.body })
    // }

    // async putEndpoint(params: ISubListQueryParams): Promise<AxiosResponse<any, any>> {
    //     return $api.put<Model>(`${params.endpoint}/`, { ...params.body })
    // }

    // async deleteEndpoint(id: number, params: ISubListQueryParams): Promise<AxiosResponse<any, any>> {
    //     return $api.delete(`${params.endpoint}/${id}/`)
    // }
}
