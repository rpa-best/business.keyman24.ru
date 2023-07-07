import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query'
import { IPermissionUser } from '../../models/permission'
import { TypeEnum } from '../../models/primitives'
import apiSlice from './index'

interface FetchProps {
    orgId: number
    username: string
}

interface CreateProps extends FetchProps {
    permission: number
    type: TypeEnum
}

interface DeleteProps extends FetchProps {
    permission: number
}

export const permissionUserApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchPermissionUser: builder.query<IPermissionUser[], FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/permission/user/${params.username}/`,
                method: 'GET',
            }),
            providesTags: (result, error, params) =>
                (result
                    ? [
                        ...result.map(item => ({
                            type: 'PermissionUser' as never,
                            id: item.id,
                        })),
                        { type: 'PermissionUser' as never, id: 'LIST' },
                    ]
                    : [{ type: 'PermissionUser' as never, id: 'LIST' }]),
        }),
        createPermissionUser: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/permission/user/${params.username}/`,
                method: 'POST',
                body: {
                    type: params.type,
                    user: params.username,
                    permission: params.permission,
                },
            }),
            invalidatesTags: [
                { type: 'PermissionUser' as never, id: 'LIST' },
            ],
        }),
        deletePermissionUser: builder.mutation<undefined, DeleteProps>({
            query: (params: DeleteProps) => ({
                url: `business/${params.orgId}/permission/user/${params.username}/${params.permission}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'PermissionUser' as never, id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useFetchPermissionUserQuery,
    useCreatePermissionUserMutation,
    useDeletePermissionUserMutation,
} = permissionUserApi
