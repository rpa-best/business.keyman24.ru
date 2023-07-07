import {
    createSlice,
    createAsyncThunk,
    isPending,
    PayloadAction,
    isRejected,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { ZodError } from 'zod'
import { type IWorker } from '../../models/worker'
import WorkerNestedElementService from '../../services/reduxServices/WorkerNestedElementService'

interface IOrganizationState {
    list: IWorker[]
    single: IWorker
    isLoading: 'list' | 'single' | null
    error: string | null
}

const initialState: IOrganizationState = {
    list: [],
    single: {} as IWorker,
    isLoading: null,
    error: null,
}

interface FetchProps {
    orgId: number
}

interface FetchByIdProps extends FetchProps {
    workerId: number
}

interface FetchByNameProps extends FetchProps {
    name: string
}

const PREFIX = 'workerNestedElement'

export const fetchWorker = createAsyncThunk<
    IWorker[],
    FetchProps,
    { rejectValue: any }
>(`${PREFIX}/fetchWorkerNestedElement`, async (data: FetchProps, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const response = await WorkerNestedElementService.fetch(
            data,
            controller.signal,
        )

        if (response.status !== 200) {
            throw new Error(`Failed to fetch ${PREFIX}`)
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

export const fetchByIdWorker = createAsyncThunk<
    IWorker,
    FetchByIdProps,
    { rejectValue: any }
>(
    `${PREFIX}/fetchByIdWorkerNestedElement`,
    async (data: FetchByIdProps, thunkApi) => {
        try {
            const controller = new AbortController()
            thunkApi.signal.addEventListener('abort', () => controller.abort())

            const response = await WorkerNestedElementService.fetchById(
                data,
                controller.signal,
            )

            if (response.status !== 200) {
                throw new Error('Failed to fetchByIdWorkerNestedElement')
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
    },
)

export const fetchByNameWorker = createAsyncThunk<
    IWorker[],
    FetchByNameProps,
    { rejectValue: any }
>(
    `${PREFIX}/fetchByNameWorkerNestedElement`,
    async (data: FetchByNameProps, thunkApi) => {
        try {
            const controller = new AbortController()
            thunkApi.signal.addEventListener('abort', () => controller.abort())

            const response = await WorkerNestedElementService.fetchByName(
                data,
                controller.signal,
            )

            if (response.status !== 200) {
                throw new Error('Failed tofetchByNameWorkerNestedElement')
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
    },
)

const workerNestedElementSlice = createSlice({
    name: PREFIX,
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchWorker.fulfilled, (state, action) => {
                state.list = (action as any).payload.results
                state.isLoading = null
                state.error = null
                console.log('fetchWorker fulfilled')
            })
            .addCase(fetchByNameWorker.fulfilled, (state, action) => {
                state.list = (action as any).payload.results
                state.isLoading = null
                state.error = null
                console.log('fetchByNameWorker fulfilled')
            })
            .addCase(fetchByIdWorker.fulfilled, (state, { payload }) => {
                state.single = payload
                state.isLoading = null
                state.error = null
                console.log('fetchByIdWorker fulfilled')
            })
            .addMatcher(isPending(fetchByIdWorker), state => {
                state.isLoading = 'single'
                state.error = null
                console.log('fetchByIdWorker is pending')
            })
            .addMatcher(isPending(fetchByNameWorker, fetchWorker), state => {
                state.isLoading = 'list'
                state.error = null
                console.log('fetchByNameWorker is pending')
            })
            .addMatcher(
                isRejected(fetchByNameWorker, fetchWorker, fetchByIdWorker),
                (state, action) => {
                    state.error = action.meta.aborted
                        ? 'aborted'
                        : action.payload
                    state.isLoading = action.meta.aborted
                        ? state.isLoading
                        : null
                    // console.log('org list is rejected', payload)
                },
            )
    },
})

export default workerNestedElementSlice.reducer
