import { IWorkerNestedLocation } from '../../models/workerNestedLocation'
import apiSlice from './index'

interface FetchProps {
    orgId: number
    locationId: number
}

interface CreateProps extends FetchProps {
    location: number
    worker: number
}

interface DefaultServerRes {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: IWorkerNestedLocation[] | []
}

const PREFIX = 'WorkerNestedLocation'

export const workerNestedLocationApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchWorkerNestedLocation: builder.query<DefaultServerRes, FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/location/${params.locationId}/worker/`,
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
        createWorkerNestedLocation: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/location/${params.locationId}/worker/`,
                method: 'POST',
                body: {
                    location: params.location,
                    worker: params.worker,
                },
            }),
            invalidatesTags: [
                { type: PREFIX as never, id: 'LIST' },
            ],
        }),
        deleteWorkerNestedLocation: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/location/${params.locationId}/worker/${params.worker}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: PREFIX as never, id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useFetchWorkerNestedLocationQuery,
    useCreateWorkerNestedLocationMutation,
    useDeleteWorkerNestedLocationMutation,
} = workerNestedLocationApi
