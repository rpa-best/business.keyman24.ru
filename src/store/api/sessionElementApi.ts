import { type ISessionElement } from '../../models/sessionElement'
import apiSlice from './index'

interface FetchProps  {
    orgId: number
    areaId: number
    sessionId: number
}

interface DefaultServerRes {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: ISessionElement[] | []
}

const PREFIX = 'SessionElement'

export const sessionElementApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchSessionElement: builder.query<DefaultServerRes, FetchProps>({
            query: (params: FetchProps) => ({
                url: `business/${params.orgId}/working_area/${params.areaId}/session/${params.sessionId}/element/`,
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
    }),
})

export const {
    useFetchSessionElementQuery,
} = sessionElementApi
