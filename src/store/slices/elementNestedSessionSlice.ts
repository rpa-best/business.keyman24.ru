import {
    createSlice,
    createAsyncThunk,
    isPending,
    PayloadAction,
    isRejected,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { ZodError } from 'zod'
import {
    type ISessionElement,
    SessionElementSchema,
} from '../../models/sessionElement'
import ElementNestedSessionService from '../../services/reduxServices/ElementNestedSessionService'
import IQueryParams from '../../models/IQueryParams'

interface FetchParams {
    data: {
        orgId: number
        areaId: number
        sessionId: number
    }
    params: IQueryParams
}

interface DefaultServerRes {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: ISessionElement[]
}

interface ISessionElementState {
    list: ISessionElement[]
    single: ISessionElement
    count: number
    offset: number
    orderBy: string
    isLoading: 'list' | 'single' | null
    error: string | null
}

const initialState: ISessionElementState = {
    list: [],
    single: {} as ISessionElement,
    count: 0,
    offset: 0,
    orderBy: '-date',
    isLoading: null,
    error: null,
}

const PREFIX = 'elementNestedSession'

export const fetchElementWithParams = createAsyncThunk<
    DefaultServerRes,
    FetchParams,
    { rejectValue: any }
>(`${PREFIX}/fetchElementWithParams`, async (data: FetchParams, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const checkOffset = data.params?.offset ?? 0
        const checkOrderBy = data.params?.orderBy ?? 'id'
        // eslint-disable-next-line no-use-before-define
        thunkApi.dispatch(changeOffsetElement(checkOffset))
        // eslint-disable-next-line no-use-before-define
        thunkApi.dispatch(changeOrderingElement(checkOrderBy))

        const response = await ElementNestedSessionService.fetchWithParams(
            data.data,
            {
                offset: checkOffset,
                orderBy: checkOrderBy,
                filter: data.params?.filter,
            },
            controller.signal,
        )

        if (response.status !== 200) {
            throw new Error(`Failed to fetchElementWithParams ${PREFIX}`)
        }

        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkApi.rejectWithValue(error.message)
        }

        if (error instanceof ZodError) {
            return thunkApi.rejectWithValue(error.message)
        }

        return thunkApi.rejectWithValue(error)
    }
})

const elementNestedSessionSlice = createSlice({
    name: PREFIX,
    initialState,
    reducers: {
        changeOrderingElement: (state, action: PayloadAction<string>) => {
            state.orderBy = action.payload
        },
        changeOffsetElement: (state, action: PayloadAction<number>) => {
            state.offset = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchElementWithParams.fulfilled, (state, { payload }) => {
                state.list = payload.results
                state.count = payload.count
                state.isLoading = null
                state.error = null
                console.log(`fetchWithParams ${PREFIX} fulfilled`)
            })
            .addMatcher(isPending(fetchElementWithParams), state => {
                state.isLoading = 'list'
                state.error = null
                console.log(`${PREFIX} list pending`)
            })
            .addMatcher(isRejected(fetchElementWithParams), (state, action) => {
                state.error = action.meta.aborted ? 'aborted' : action.payload
                state.isLoading = action.meta.aborted ? state.isLoading : null
                // console.error('rejected', action)
            })
    },
})

export const { changeOrderingElement, changeOffsetElement } =
    elementNestedSessionSlice.actions

export default elementNestedSessionSlice.reducer
