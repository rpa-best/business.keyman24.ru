import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { ZodError } from 'zod'
import {
    AuthResponseSchema,
    type IAuthRequest,
    type IAuthResponse,
} from '../../models/accountAuth'
import AccountService from '../../services/reduxServices/AccountService'
import {
    AccountDetailSchema,
    type IAccountDetail,
} from '../../models/accountDetail'

interface IAccountState {
    user: IAccountDetail | null
    isAuth: boolean
    isLoading: boolean
    error: any | null
}

const initialState: IAccountState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: null,
}

const PREFIX = 'account'

export const auth = createAsyncThunk<
    IAuthResponse,
    IAuthRequest,
    { rejectValue: any }
>(`${PREFIX}/auth`, async (body: IAuthRequest, thunkApi) => {
    try {
        const response = await AccountService.auth(body)

        if (response.status !== 201) {
            throw new Error('Failed to account/auth.')
        }

        // return AuthResponseSchema.parse(response.data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkApi.rejectWithValue(error.response?.data)
        }

        if (error instanceof ZodError) {
            return thunkApi.rejectWithValue(error.message)
        }

        return thunkApi.rejectWithValue(error)
    }
})

export const me = createAsyncThunk<
    IAccountDetail,
    undefined,
    { rejectValue: any }
>(`${PREFIX}/me`, async (_, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const response = await AccountService.me(controller.signal)

        if (response.status !== 200) {
            throw new Error('Failed to account/me')
        }

        // console.log(response.headers)

        // return AccountDetailSchema.parse(response.data)
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

const accountSlice = createSlice({
    name: PREFIX,
    initialState,
    reducers: {
        logout: () => {
            localStorage.removeItem('token-access')
            localStorage.removeItem('token-refresh')
            return initialState
        },
    },
    extraReducers: builder => {
        builder
            .addCase(auth.pending, state => {
                state.isLoading = true
                state.isAuth = false
                state.error = null
                // console.log('accountSlice auth.pending')
            })
            .addCase(auth.fulfilled, (state, { payload }) => {
                localStorage.setItem('token-access', payload.access)
                localStorage.setItem('token-refresh', payload.refresh)
                state.isLoading = false
                state.isAuth = true
                state.error = null
                // console.log('accountSlice auth.fulfilled')
            })
            .addCase(auth.rejected, (state, { payload }) => {
                state.error = payload
                state.isLoading = false
                state.isAuth = false
                // console.log('accountSlice auth.rejected', payload)
            })
            // account/me
            .addCase(me.pending, state => {
                state.isLoading = true
                state.isAuth = false
                // state.error = null
            })
            .addCase(me.fulfilled, (state, { payload }) => {
                state.user = payload
                state.isLoading = false
                state.isAuth = true
                // state.error = null
            })
            .addCase(me.rejected, (state, action) => {
                // if (!action.meta.aborted) {
                //     state.isLoading = false
                //     state.isAuth = false
                //     state.error = action.payload
                //     localStorage.removeItem('token-access')
                //     localStorage.removeItem('token-refresh')
                //     console.log('accountSlice me.rejected')
                //     console.log(action.payload)
                // }
                state.isLoading = false
                state.isAuth = false
                // state.error = action.payload
                localStorage.removeItem('token-access')
                localStorage.removeItem('token-refresh')
                // console.log('accountSlice me.rejected')
                // console.log(action.payload)
            })
    },
})

export const { logout } = accountSlice.actions

export default accountSlice.reducer
