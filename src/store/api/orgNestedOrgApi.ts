import { IOrganization } from '../../models/organization'
import apiSlice from './index'

interface FetchProps {
    orgId: number
}

const PREFIX = 'OrgNestedOrg'

export const orgNestedOrgApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchOrgNestedOrg: builder.query<IOrganization[], FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/org/`,
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
    }),
})

export const { useFetchOrgNestedOrgQuery } = orgNestedOrgApi
