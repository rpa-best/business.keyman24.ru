import {
    createSlice,
    createAsyncThunk,
    isPending,
    isRejected,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import React from 'react'
import ToastMessage from '../../components/ToastMessage'
import { IBusinessUser } from '../../models/user'
import UserService from '../../services/reduxServices/UserService'

interface IUserState {
    list: IBusinessUser[]
    single: IBusinessUser
    isLoading: 'single' | 'list' | null
    error: string | null
}

const initialState: IUserState = {
    list: [],
    single: {} as IBusinessUser,
    isLoading: null,
    error: null,
}

const PREFIX = 'workerUser'

export const fetchUser = createAsyncThunk<any, number, { rejectValue: any }>(
    `${PREFIX}/fetch${PREFIX}`,
    async (data: number, thunkApi) => {
        try {
            const controller = new AbortController()
            thunkApi.signal.addEventListener('abort', () => controller.abort())

            const response = await UserService.fetch(controller.signal)

            if (response.status !== 200) {
                throw new Error(`Failed to fetch ${PREFIX}`)
            }

            return response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                return thunkApi.rejectWithValue(error.message)
            }

            return thunkApi.rejectWithValue(error)
        }
    },
)

export const fetchByIdUser = createAsyncThunk<
    any,
    number,
    { rejectValue: any }
>(`${PREFIX}/fetchById${PREFIX}`, async (data: number, thunkApi) => {
    try {
        const controller = new AbortController()
        thunkApi.signal.addEventListener('abort', () => controller.abort())

        const response = await UserService.fetchById(data, controller.signal)

        if (response.status !== 200) {
            throw new Error(`Failed to fetchById ${PREFIX}`)
        }

        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkApi.rejectWithValue(error.message)
        }

        return thunkApi.rejectWithValue(error)
    }
})

export const createUser = createAsyncThunk<any, any, { rejectValue: any }>(
    `${PREFIX}/create${PREFIX}`,
    async (data: { id: number; data: any }, thunkApi) => {
        try {
            const controller = new AbortController()
            thunkApi.signal.addEventListener('abort', () => controller.abort())

            const response = await UserService.create(
                data.id,
                data.data,
                controller.signal,
            )

            if (response.status !== 201) {
                throw new Error(`Failed to create ${PREFIX}`)
            }

            return response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(
                    <ToastMessage
                        name='Ошибка'
                        desc={`${error.response?.data[0].field}: ${error.response?.data[0].message.desc}`}
                    />,
                    {
                        position: 'bottom-right',
                        toastId: 'customId',
                        theme: 'colored',
                    },
                )
                return thunkApi.rejectWithValue(error.message)
            }

            return thunkApi.rejectWithValue(error)
        }
    },
)

export const patchUser = createAsyncThunk<any, any, { rejectValue: any }>(
    `${PREFIX}/patch${PREFIX}`,
    async (data: { id: number; data: any }, thunkApi) => {
        try {
            const controller = new AbortController()
            thunkApi.signal.addEventListener('abort', () => controller.abort())

            const response = await UserService.patch(
                data.id,
                data.data,
                controller.signal,
            )

            if (response.status !== 200) {
                throw new Error(`Failed to patch ${PREFIX}`)
            }

            return response.data
        } catch (error) {
            if (error instanceof AxiosError) {
                return thunkApi.rejectWithValue(error.message)
            }

            return thunkApi.rejectWithValue(error)
        }
    },
)

const userSlice = createSlice({
    name: PREFIX,
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.list = payload
                state.isLoading = null
                state.error = null
                console.log(`fetchById ${PREFIX} fulfilled`)
            })
            .addCase(fetchByIdUser.fulfilled, (state, { payload }) => {
                state.single = payload
                state.isLoading = null
                state.error = null
                console.log(`fetchById ${PREFIX} fulfilled`)
            })
            .addCase(createUser.fulfilled, (state, { payload }) => {
                state.isLoading = null
                state.error = null
                console.log(`create ${PREFIX} fulfilled`)
            })
            .addCase(patchUser.fulfilled, (state, { payload }) => {
                state.single = {} as IBusinessUser
                state.isLoading = null
                state.error = null
                console.log(`patch ${PREFIX} fulfilled`)
            })
            .addMatcher(
                isPending(fetchByIdUser, createUser, patchUser),
                state => {
                    state.isLoading = 'single'
                    state.error = null
                    console.log(`${PREFIX} single pending`)
                },
            )
            .addMatcher(isPending(fetchUser), state => {
                state.isLoading = 'list'
                state.error = null
                console.log(`${PREFIX} list pending`)
            })
            .addMatcher(
                isRejected(fetchUser, fetchByIdUser, createUser, patchUser),
                (state, action) => {
                    state.error = action.meta.aborted
                        ? 'aborted'
                        : action.payload
                    state.isLoading = action.meta.aborted
                        ? state.isLoading
                        : null
                    state.single = {} as IBusinessUser
                    // console.error(`${this.name} rejected`, state.error
                },
            )
    },
})

export default userSlice.reducer
