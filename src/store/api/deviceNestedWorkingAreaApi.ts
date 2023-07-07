import { IDeviceNestedWorkingArea } from '../../models/deviceNestedWorkingArea'
import apiSlice from './index'

interface FetchProps {
    orgId: number
    workingAreaId: number
}

interface CreateProps extends FetchProps {
    deviceId: number
}

interface DeleteProps extends FetchProps {
    deviceId: number
}

interface DefaultServerRes {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: IDeviceNestedWorkingArea[]
}

const PREFIX = 'DeviceNestedWorkingArea'

export const deviceNestedWorkingAreaApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchDeviceNestedWorkingArea: builder.query<
            DefaultServerRes,
            FetchProps
        >({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/working_area/${params.workingAreaId}/device/`,
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
        createDeviceNestedWorkingArea: builder.mutation<undefined, CreateProps>(
            {
                query: (params: CreateProps) => ({
                    url: `business/${params.orgId}/working_area/${params.workingAreaId}/device/`,
                    method: 'POST',
                    body: {
                        area: params.workingAreaId,
                        device: params.deviceId,
                    },
                }),
                invalidatesTags: [{ type: PREFIX as never, id: 'LIST' }],
            },
        ),
        deleteDeviceNestedWorkingArea: builder.mutation<undefined, DeleteProps>(
            {
                query: (params: DeleteProps) => ({
                    url: `business/${params.orgId}/working_area/${params.workingAreaId}/device/${params.deviceId}/`,
                    method: 'DELETE',
                }),
                invalidatesTags: [{ type: PREFIX as never, id: 'LIST' }],
            },
        ),
    }),
})

export const {
    useFetchDeviceNestedWorkingAreaQuery,
    useCreateDeviceNestedWorkingAreaMutation,
    useDeleteDeviceNestedWorkingAreaMutation,
} = deviceNestedWorkingAreaApi
