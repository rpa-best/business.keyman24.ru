import { AxiosResponse } from 'axios'
import IQueryParams from './IQueryParams'
import ISubListQueryParams from './ISubListQueryParams'

export default interface IService {
    fetch(signal: AbortSignal): Promise<AxiosResponse>
    fetchById(id: number, signal: AbortSignal): Promise<AxiosResponse>
    fetchWithParams(params: IQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    fetchByName(name: string, signal: AbortSignal): Promise<AxiosResponse>
    create(data: any, signal: AbortSignal): Promise<AxiosResponse>
    put(data: any, signal: AbortSignal): Promise<AxiosResponse>
    patch(data: any, signal: AbortSignal): Promise<AxiosResponse>
    delete(id: number, signal: AbortSignal): Promise<AxiosResponse>
    head(signal: AbortSignal): Promise<AxiosResponse>
    // nested entity
    fetchWithParamsNested(params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    fetchByIdNested(id: number, params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    createNested(data: any, params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    putNested(data: any, params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    patchNested(data: any, params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    deleteNested(id: number, params: ISubListQueryParams, signal: AbortSignal): Promise<AxiosResponse>
    // free endpoint
    // fetchEndpointWithParams(params: ISubListQueryParams): Promise<AxiosResponse>
    // fetchEndpointById(id: number, params: ISubListQueryParams): Promise<AxiosResponse>
    // createEndpoint(params: ISubListQueryParams): Promise<AxiosResponse>
    // putEndpoint(params: ISubListQueryParams): Promise<AxiosResponse>
    // deleteEndpoint(id: number, params: ISubListQueryParams): Promise<AxiosResponse>
}
