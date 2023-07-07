import { IOrgNestedLocation } from '../../models/orgNestedLocation'
import apiSlice from './index'

interface FetchProps {
    orgId: number
    locationId: number
}

interface CreateProps extends FetchProps {
    location: number
    to_org: number
}

// [{ type: 'PermissionGroupUser' as never, id: params.orgId }],

interface DefaultServerRes {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: IOrgNestedLocation[] | []
}

const PREFIX = 'OrgNestedLocation'

export const orgNestedLocationApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchOrgNestedLocation: builder.query<DefaultServerRes, FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/location/${params.locationId}/org/`,
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
        createOrgNestedLocation: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/location/${params.locationId}/org/`,
                method: 'POST',
                body: {
                    location: params.location,
                    to_org: params.to_org,
                },
            }),
            invalidatesTags: [
                { type: PREFIX as never, id: 'LIST' },
            ],
        }),
        deleteOrgNestedLocation: builder.mutation<undefined, CreateProps>({
            query: (params: CreateProps) => ({
                url: `business/${params.orgId}/location/${params.locationId}/org/${params.to_org}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: PREFIX as never, id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useFetchOrgNestedLocationQuery,
    useCreateOrgNestedLocationMutation,
    useDeleteOrgNestedLocationMutation,
} = orgNestedLocationApi
