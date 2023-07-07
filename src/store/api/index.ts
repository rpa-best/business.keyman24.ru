import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

const { VITE_API_URL } = import.meta.env
const tagTypes = [
    'PermissionGroupUser',
    'PermissionUser',
]

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    fetchBaseQuery({
        baseUrl: VITE_API_URL,
        // credentials: 'include',
        prepareHeaders: (headers, { getState, endpoint }) => {
            if (endpoint !== 'refresh') {
                headers.set(
                    'Authorization',
                    `Bearer ${localStorage.getItem('token-access')}`,
                )
                headers.set('Content-Type', 'application/json',)
            }

            return headers
        },
    })

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQuery(
            {
                url: 'account/refresh-token/',
                method: 'POST',
                body: { refresh: localStorage.getItem('token-refresh') },
            },
            { ...api, endpoint: 'refresh' },
            extraOptions,
        )

        const response = refreshResult.data as any
        if (response) {
            // store the new token
            localStorage.setItem('token-access', response.access)
            localStorage.setItem('token-refresh', response.refresh)
            // retry the initial query
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}

const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
    tagTypes,
})

export default apiSlice
