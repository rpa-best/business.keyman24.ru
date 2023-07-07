import { FetchArgs } from '@reduxjs/toolkit/query'
import { type IWorker } from '../../models/worker'
import { type IWorkerDocs } from '../../models/workerDocs'
import apiSlice from './index'

interface FetchProps {
    orgId: number
}

interface FetchByIdProps extends FetchProps {
    workerId: number
}

interface DefaultServerRes<T> {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: T[] | []
}

const PREFIX = 'WorkerNestedElement'

export const workerNestedElementApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchWorkerNestedElement: builder.query<
            DefaultServerRes<IWorker>,
            FetchProps
        >({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/worker/?ordering=id`,
                method: 'GET',
            }),
            providesTags: (result, error, params) =>
                (result
                    ? [
                        ...result.results.map(item => ({
                            type: PREFIX as never,
                            id: item.id,
                        })),
                        { type: PREFIX as never, id: 'LIST' },
                    ]
                    : [{ type: PREFIX as never, id: 'LIST' }]),
        }),
        fetchByIdWorkerNestedElement: builder.query<IWorker, FetchByIdProps>({
            query: (params: FetchByIdProps) => {
                // if (params.orgId !== 0 && params.workerId !== 0) {
                //     return {
                //         url: `business/${params.orgId}/worker/${params.workerId}/`,
                //         method: 'GET',
                //     }
                // }

                // return null

                return {
                    url: `business/${params.orgId}/worker/${params.workerId}/`,
                    method: 'GET',
                }
            },
            providesTags: (result, error, params) => [
                { type: PREFIX, id: params.workerId },
            ],
        }),
        fetchByIdWorkerDocsNestedElement: builder.query<
            DefaultServerRes<IWorkerDocs>,
            FetchByIdProps
        >({
            query: (params: FetchByIdProps) => {
                return {
                    url: `business/${params.orgId}/worker/${params.workerId}/docs/`,
                    method: 'GET',
                }
            },
            providesTags: (result, error, params) =>
                (result
                    ? [
                        ...result.results.map(item => ({
                            type: 'WorkerNestedElement' as never,
                            id: item.id,
                        })),
                        { type: 'WorkerNestedElement' as never, id: 'LIST' },
                    ]
                    : [{ type: 'WorkerNestedElement' as never, id: 'LIST' }]),
        }),
    }),
})

export const {
    useFetchWorkerNestedElementQuery,
    useFetchByIdWorkerNestedElementQuery,
    useFetchByIdWorkerDocsNestedElementQuery,
} = workerNestedElementApi
