import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query'
import { IPermissionUser } from '../../models/permission'
import { TypeEnum } from '../../models/primitives'
import { IWorkingAreaSession } from '../../models/workingAreaSession'
import apiSlice from './index'

interface FetchProps {
    orgId: number
    workingAreaId: number
}

// interface CreateProps extends FetchProps {
//     permission: number
//     type: TypeEnum
// }

interface DeleteProps extends FetchProps {
    sessionId: number
}

const PREFIX = 'SessionNestedWorkingArea'
// [`fetch${PREFIX}`] fetchSessionNestedWorkingArea
// [`create${PREFIX}`] createSessionNestedWorkingArea
// [`delete${PREFIX}`] deleteSessionNestedWorkingArea

export const sessionNestedWorkingAreaApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchSessionNestedWorkingArea: builder.query<IWorkingAreaSession[], FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/working_area/${params.workingAreaId}/session/`,
                method: 'GET',
            }),
            providesTags: (result, error, params) =>
                (result
                    ? [
                        ...result.map(item => ({
                            type: PREFIX as never,
                            id: item.id,
                        })),
                        { type: PREFIX as never, id: 'LIST' },
                    ]
                    : [{ type: PREFIX as never, id: 'LIST' }]),
        }),
        createSessionNestedWorkingArea: builder.mutation<undefined, FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/working_area/${params.workingAreaId}/session/`,
                method: 'POST',
            }),
            invalidatesTags: [
                { type: PREFIX as never, id: 'LIST' },
            ],
        }),
        deleteSessionNestedWorkingArea: builder.mutation<undefined, DeleteProps>({
            query: (params: DeleteProps) => ({
                url: `business/${params.orgId}/working_area/${params.workingAreaId}/session/${params.sessionId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: PREFIX as never, id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useFetchSessionNestedWorkingAreaQuery,
    useCreateSessionNestedWorkingAreaMutation,
    useDeleteSessionNestedWorkingAreaMutation,
} = sessionNestedWorkingAreaApi
