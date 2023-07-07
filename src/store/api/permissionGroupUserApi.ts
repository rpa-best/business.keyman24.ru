import { IPermissionGroupUser } from '../../models/permission'
import apiSlice from './index'

interface FetchProps {
    orgId: number
    username: string
}

interface CreateProps extends FetchProps {
    group: number
}

// [{ type: 'PermissionGroupUser' as never, id: params.orgId }],

export const permissionGroupUserApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchPermissionGroupUser: builder.query<
            IPermissionGroupUser[],
            FetchProps
        >({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/permission/group/user/${params.username}/`,
                method: 'GET',
            }),
            providesTags: (result, error, params) =>
                (result
                    ? [
                        ...result.map(item => ({
                            type: 'PermissionGroupUser' as never,
                            id: item.id,
                        })),
                        { type: 'PermissionGroupUser' as never, id: 'LIST' },
                    ]
                    : [{ type: 'PermissionGroupUser' as never, id: 'LIST' }]),
        }),
        createPermissionGroupUser: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/permission/group/user/${params.username}/`,
                method: 'POST',
                body: {
                    group: params.group,
                },
            }),
            invalidatesTags: [
                { type: 'PermissionGroupUser' as never, id: 'LIST' },
            ],
        }),
        deletePermissionGroupUser: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/permission/group/user/${params.username}/${params.group}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'PermissionGroupUser' as never, id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useFetchPermissionGroupUserQuery,
    useCreatePermissionGroupUserMutation,
    useDeletePermissionGroupUserMutation,
} = permissionGroupUserApi
