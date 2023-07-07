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
    type IOrganization,
    OrganizationSchema,
} from '../../models/organization'
import OrganizationService from '../../services/reduxServices/OrganizationService'

interface ICurrentOrg {
    id?: number
    name?: string
}

interface IOrganizationState {
    list: IOrganization[]
    single: IOrganization
    currentOrg: ICurrentOrg
    isLoading: 'list' | 'single' | null
    error: string | null
}

const initialState: IOrganizationState = {
    list: [],
    single: {} as IOrganization,
    currentOrg: {} as ICurrentOrg,
    isLoading: null,
    error: null,
}

const PREFIX = 'org'

export const fetchOrg = createAsyncThunk<
    IOrganization[],
    undefined,
    { rejectValue: any }
>(`${PREFIX}/fetchOrg`, async (_, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const response = await OrganizationService.fetch(controller.signal)

        if (response.status !== 200) {
            throw new Error(`Failed to fetch ${PREFIX}`)
        }

        return OrganizationSchema.array().parse(response.data)
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

export const fetchByIdOrg = createAsyncThunk<
    IOrganization,
    number,
    { rejectValue: any }
>(`${PREFIX}/fetchByIdOrg`, async (id: number, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const response = await OrganizationService.fetchById(
            id,
            controller.signal,
        )

        if (response.status !== 200) {
            throw new Error('Failed to org/fetchByIdOrg.')
        }

        return OrganizationSchema.parse(response.data)
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

export const fetchByNameOrg = createAsyncThunk<
    IOrganization[],
    string,
    { rejectValue: any }
>(`${PREFIX}/fetchByNameOrg`, async (name: string, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const response = await OrganizationService.fetchByName(
            name,
            controller.signal,
        )

        if (response.status !== 200) {
            throw new Error('Failed to org/fetchByNameOrg.')
        }

        return OrganizationSchema.array().parse(response.data)
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

const organizationSlice = createSlice({
    name: PREFIX,
    initialState,
    reducers: {
        setOrganization: (state, action: PayloadAction<ICurrentOrg>) => {
            state.currentOrg = { ...action.payload }
            //! remove this
            localStorage.setItem('currOrg', JSON.stringify(action.payload.id))
        },
        removeOrganization: state => {
            state.currentOrg = {} as ICurrentOrg
            //! remove this
            localStorage.removeItem('currOrg')
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchOrg.fulfilled, (state, { payload }) => {
                state.list = payload
                state.isLoading = null
                state.error = null
                console.log('fetchOrg fulfilled')
            })
            .addCase(fetchByNameOrg.fulfilled, (state, { payload }) => {
                state.list = payload
                state.isLoading = null
                state.error = null
                console.log('fetchByNameOrg fulfilled')
            })
            .addCase(fetchByIdOrg.fulfilled, (state, { payload }) => {
                state.currentOrg = { id: payload.id, name: payload.name }
                //! remove this
                // localStorage.setItem('currOrg', JSON.stringify(payload.id))
                state.isLoading = null
                state.error = null
                console.log('fetchByIdOrg fulfilled')
            })
            .addMatcher(isPending(fetchByIdOrg), state => {
                state.isLoading = 'single'
                state.error = null
                console.log('org single is pending')
            })
            .addMatcher(isPending(fetchByNameOrg, fetchOrg), state => {
                state.isLoading = 'list'
                state.error = null
                console.log('org list is pending')
            })
            .addMatcher(
                isRejected(fetchByNameOrg, fetchOrg, fetchByIdOrg),
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

export const { setOrganization, removeOrganization } = organizationSlice.actions

export default organizationSlice.reducer
