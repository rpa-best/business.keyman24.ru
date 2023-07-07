import React from 'react'
import {
    AsyncThunkAction,
    createSlice,
    isPending,
    isRejected,
} from '@reduxjs/toolkit'
import { z } from 'zod'
import { toast } from 'react-toastify'
import IQueryParams from '../models/IQueryParams'
import IService from '../models/IService'
import ISubListQueryParams from '../models/ISubListQueryParams'
import ToastMessage from '../components/ToastMessage'
import { PermissionEnum } from '../models/primitives'
import thunks from './AsyncThunkService'

export interface ReducerServiceProps<Model, CreateInput> {
    name: string
    service: IService
    validationSchema: Model
    validationInputSchema: CreateInput
    initialOrdering?: string
}

interface GenericState<T> {
    list: T[]
    single: T
    count: number
    offset: number
    orderBy: string
    isLoading: 'list' | 'single' | 'head' | null
    error: string | null
    head: boolean
    permissions: PermissionEnum[]
}

export interface ReducerServiceInterface {
    fetch(): AsyncThunkAction<any, any, any>
    fetchById(id: number): AsyncThunkAction<any, any, any>
    fetchWithParams(params?: IQueryParams): AsyncThunkAction<any, any, any>
    create(data: any): AsyncThunkAction<any, any, any>
    put(data: any): AsyncThunkAction<any, any, any>
    patch(data: any): AsyncThunkAction<any, any, any>
    clearSingle(): AsyncThunkAction<any, any, any>
    delete(id: number): AsyncThunkAction<any, any, any>
    head(): AsyncThunkAction<any, any, any>
    changeOffset(offset: number): AsyncThunkAction<any, any, any>
    changeOrdering(orderBy: string): AsyncThunkAction<any, any, any>
    fetchWithParamsNested(
        params: ISubListQueryParams,
    ): AsyncThunkAction<any, any, any>
    fetchByIdNested(
        id: number,
        params: ISubListQueryParams,
    ): AsyncThunkAction<any, any, any>
    createNested(
        data: any,
        params: ISubListQueryParams,
    ): AsyncThunkAction<any, any, any>
    putNested(
        data: any,
        params: ISubListQueryParams,
    ): AsyncThunkAction<any, any, any>
    patchNested(
        data: any,
        params: ISubListQueryParams,
    ): AsyncThunkAction<any, any, any>
    deleteNested(
        id: number,
        params: ISubListQueryParams,
    ): AsyncThunkAction<any, any, any>
}

export default class ReducerService<
    Model extends z.AnyZodObject,
    CreateInput extends z.AnyZodObject,
> implements ReducerServiceInterface {
    private name: string

    // private service: IService<z.infer<Model>, z.infer<CreateInput>>
    private service: IService

    // model: z.infer<Model>

    // createInput: z.infer<CreateInput>

    private validationSchema: Model

    private validationInputSchema: CreateInput

    private initialState: GenericState<z.infer<Model>>

    constructor(props: ReducerServiceProps<Model, CreateInput>) {
        this.name = props.name
        this.service = props.service
        this.validationSchema = props.validationSchema
        this.validationInputSchema = props.validationInputSchema

        this.initialState = {
            list: [],
            single: {} as z.infer<Model>,
            count: 0,
            offset: 0,
            orderBy: props.initialOrdering || 'id',
            isLoading: null,
            error: null,
            head: false,
            permissions: [],
        }
    }

    fetch() {
        const callAction = thunks.fetchThunk(
            this.name,
            this.service,
            this.validationSchema,
        )
        return callAction()
    }

    fetchById(id: number) {
        const callAction = thunks.fetchByIdThunk(this.name, this.service)
        return callAction(id)
    }

    fetchWithParams(params?: IQueryParams) {
        const callAction = thunks.fetchWithParamsThunk(this.name, this.service)

        const checkOffset = params?.offset ?? 0
        const checkOrderBy = params?.orderBy ?? 'id'
        this.changeOffset(checkOffset)
        this.changeOrdering(checkOrderBy)

        return callAction({
            offset: checkOffset,
            orderBy: checkOrderBy,
            filter: params?.filter,
        })
    }

    create(data: z.infer<typeof this.validationInputSchema>) {
        const callAction = thunks.createThunk(this.name, this.service)
        return callAction(data)
    }

    put(data: any) {
        const callAction = thunks.putThunk(this.name, this.service)
        return callAction(data)
    }

    patch(data: any) {
        const callAction = thunks.patchThunk(this.name, this.service)
        return callAction(data)
    }

    clearSingle() {
        const callAction = thunks.clearSingleThunk(this.name)
        return callAction()
    }

    delete(id: number) {
        const callAction = thunks.deleteThunk(this.name, this.service)
        return callAction(id)
    }

    head() {
        const callAction = thunks.headThunk(this.name, this.service)
        return callAction()
    }

    changeOffset(offset: number) {
        const callAction = thunks.changeOffsetThunk(this.name)
        return callAction(offset)
    }

    changeOrdering(orderBy: string) {
        const callAction = thunks.changeOrderingThunk(this.name)
        return callAction(orderBy)
    }

    // nested entity

    fetchWithParamsNested(params: ISubListQueryParams) {
        const callAction = thunks.fetchWithParamsNestedThunk(
            this.name,
            this.service,
        )

        const checkOffset = params?.offset ?? 0
        const checkOrderBy = params?.orderBy ?? 'id'
        this.changeOffset(checkOffset)
        this.changeOrdering(checkOrderBy)

        return callAction({
            offset: checkOffset,
            orderBy: checkOrderBy,
            ...params,
        })
    }

    fetchByIdNested(id: number, params: ISubListQueryParams) {
        const callAction = thunks.fetchByIdNestedThunk(this.name, this.service)
        return callAction({ id, params })
    }

    createNested(
        data: z.infer<typeof this.validationInputSchema>,
        params: ISubListQueryParams,
    ) {
        const callAction = thunks.createNestedThunk(this.name, this.service)
        return callAction({ data, params })
    }

    putNested(data: any, params: ISubListQueryParams) {
        const callAction = thunks.putNestedThunk(this.name, this.service)
        return callAction({ data, params })
    }

    patchNested(data: any, params: ISubListQueryParams) {
        const callAction = thunks.patchNestedThunk(this.name, this.service)
        return callAction({ data, params })
    }

    deleteNested(id: number, params: ISubListQueryParams) {
        const callAction = thunks.deleteNestedThunk(this.name, this.service)
        return callAction({ id, params })
    }

    // free endpoint

    // fetchEndpointWithParams(params: ISubListQueryParams) {
    //     const callAction = thunks.fetchEndpointWithParamsThunk(
    //         this.name,
    //         this.service,
    //     )

    //     const checkOffset = params?.offset ?? 0
    //     const checkOrderBy = params?.orderBy ?? 'id'
    //     this.changeOffset(checkOffset)
    //     this.changeOrdering(checkOrderBy)

    //     return callAction({
    //         offset: checkOffset,
    //         orderBy: checkOrderBy,
    //         endpoint: params.endpoint,
    //     })
    // }

    // fetchEndpointById(id: number, params: ISubListQueryParams) {
    //     const callAction = thunks.fetchEndpointByIdThunk(
    //         this.name,
    //         this.service,
    //     )
    //     return callAction({ id, params })
    // }

    // createEndpoint(params: ISubListQueryParams) {
    //     const callAction = thunks.createEndpointThunk(this.name, this.service)
    //     return callAction(params)
    // }

    // putEndpoint(params: ISubListQueryParams) {
    //     const callAction = thunks.putEndpointThunk(this.name, this.service)
    //     return callAction(params)
    // }

    // deleteEndpoint(id: number, params: ISubListQueryParams) {
    //     const callAction = thunks.deleteEndpointThunk(this.name, this.service)
    //     return callAction({ id, params })
    // }

    slice() {
        return createSlice({
            name: this.name,
            initialState: this.initialState,
            reducers: {},
            extraReducers: builder => {
                builder
                    .addCase(
                        thunks.fetchThunk(
                            this.name,
                            this.service,
                            this.validationSchema,
                        ).fulfilled,
                        (state, { payload }) => {
                            if (
                                this.name === 'permission'
                                || this.name === 'permissionNested'
                            ) {
                                state.list = payload
                            } else {
                                state.list = payload.results
                            }
                            state.count = payload.count
                            state.permissions = payload.permissions
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`fetch ${this.name} fulfilled`)
                        },
                    )
                    .addCase(
                        thunks.fetchByIdThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.single = payload
                            state.isLoading = state.isLoading === 'single'
                                ? null
                                : state.isLoading
                            // const a = state.single
                            // console.log(a)
                            state.error = null
                            console.log(`fetchById ${this.name} fulfilled`)
                        },
                    )
                    .addCase(
                        thunks.fetchWithParamsThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.list = payload.results
                            state.count = payload.count
                            state.permissions = payload.permissions
                            // state.offset = payload.next_offset - 10
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(
                                `fetchWithParams ${this.name} fulfilled`,
                            )
                        },
                    )
                    .addCase(
                        thunks.createThunk(this.name, this.service).fulfilled,
                        (state, { payload }) => {
                            state.list?.push(payload)
                            state.count += 1
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`create ${this.name} fulfilled`)
                        },
                    )
                    .addCase(
                        thunks.putThunk(this.name, this.service).fulfilled,
                        (state, { payload }) => {
                            // if (payload.id) {
                            //     state.list = state.list.map((item: any) =>
                            //         (item.id === payload.id ? payload : item))
                            // }
                            // if (payload.type) {
                            //     state.list = state.list.map((item: any) =>
                            //         (item.type?.slug === payload.type
                            //             ? payload
                            //             : item))
                            // }
                            state.list = state.list.map((item: any) =>
                                (item.id === payload.id ? payload : item))
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`put ${this.name} fulfilled`)
                            console.log(state.list)
                        },
                    )
                    .addCase(
                        thunks.patchThunk(this.name, this.service).fulfilled,
                        (state, { payload }) => {
                            // if (payload.id) {
                            //     state.list = state.list.map((item: any) =>
                            //         (item.id === payload.id ? payload : item))
                            // }
                            // if (payload.type) {
                            //     state.list = state.list.map((item: any) =>
                            //         (item.type?.slug === payload.type
                            //             ? payload
                            //             : item))
                            // }
                            state.list = state.list.map((item: any) =>
                                (item.id === payload.id ? payload : item))
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`patch ${this.name} fulfilled`)
                            console.log(state.list)
                        },
                    )
                    .addCase(
                        thunks.deleteThunk(this.name, this.service).fulfilled,
                        (state, { payload }) => {
                            console.log(payload)
                            state.list = state.list.filter(
                                (item: any) => item.id !== payload,
                            )
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(state.list)
                            console.log(`delete ${this.name} fulfilled`)
                        },
                    )
                    .addCase(
                        thunks.headThunk(this.name, this.service).fulfilled,
                        (state, { payload }) => {
                            state.isLoading = state.isLoading === 'head'
                                ? null
                                : state.isLoading
                            state.error = null
                            state.head = payload
                            console.log(`head ${payload} fulfilled`)
                        },
                    )
                    // .addCase(
                    //     thunks.clearSingleThunk(this.name).fulfilled,
                    //     (state, { payload }) => {
                    //         state.single = null
                    //         state.isLoading = false
                    //         state.error = null
                    //         console.log(`clearSingle ${this.name} fulfilled`)
                    //     },
                    // )
                    .addCase(
                        thunks.changeOffsetThunk(this.name).fulfilled,
                        (state, { payload }) => {
                            state.offset = payload
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`changeOffset ${this.name} fulfilled`)
                        },
                    )
                    .addCase(
                        thunks.changeOrderingThunk(this.name).fulfilled,
                        (state, { payload }) => {
                            state.orderBy = payload
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`changeOrdering ${this.name} fulfilled`)
                        },
                    )
                    // nested entity
                    .addCase(
                        thunks.fetchWithParamsNestedThunk(
                            this.name,
                            this.service,
                        ).fulfilled,
                        (state, { payload }) => {
                            if (
                                this.name === 'permission'
                                || this.name === 'permissionNested'
                            ) {
                                state.list = payload
                            } else {
                                state.list = payload.results
                            }
                            state.count = payload.count
                            state.permissions = payload.permissions
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(
                                `fetchWithParamsNested ${this.name} fulfilled`,
                            )
                        },
                    )
                    .addCase(
                        thunks.fetchByIdNestedThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.single = payload
                            state.isLoading = state.isLoading === 'single'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(
                                `fetchByIdNested ${this.name} fulfilled`,
                            )
                        },
                    )
                    .addCase(
                        thunks.createNestedThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.list?.push(payload)
                            state.count += 1
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`createNested ${this.name} fulfilled`)
                        },
                    )
                    .addCase(
                        thunks.putNestedThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.list = state.list.map((item: any) =>
                                (item.id === payload.id ? payload : item))
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`putNested ${this.name} fulfilled`)
                            console.log(state.list)
                        },
                    )
                    .addCase(
                        thunks.patchNestedThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.list = state.list.map((item: any) =>
                                (item.id === payload.id ? payload : item))
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`patchNested ${this.name} fulfilled`)
                            console.log(state.list)
                        },
                    )
                    .addCase(
                        thunks.deleteNestedThunk(this.name, this.service)
                            .fulfilled,
                        (state, { payload }) => {
                            state.list = state.list.filter(
                                (item: any) => item.id !== payload.id,
                            )
                            state.isLoading = state.isLoading === 'list'
                                ? null
                                : state.isLoading
                            state.error = null
                            console.log(`deleteNested ${this.name} fulfilled`)
                        },
                    )
                    // free endpoint
                    // .addCase(
                    //     thunks.fetchEndpointWithParamsThunk(
                    //         this.name,
                    //         this.service,
                    //     ).fulfilled,
                    //     (state, { payload }) => {
                    //         state.list = payload.results
                    //         state.count = payload.count
                    //         state.isLoading = null
                    //         state.error = null
                    //         console.log(
                    //             `fetchEndpointWithParams ${this.name} fulfilled`,
                    //         )
                    //     },
                    // )
                    // .addCase(
                    //     thunks.fetchEndpointByIdThunk(this.name, this.service)
                    //         .fulfilled,
                    //     (state, { payload }) => {
                    //         state.single = payload
                    //         state.isLoading = null
                    //         state.error = null
                    //         console.log(
                    //             `fetchEndpointById ${this.name} fulfilled`,
                    //         )
                    //     },
                    // )
                    // .addCase(
                    //     thunks.createEndpointThunk(this.name, this.service)
                    //         .fulfilled,
                    //     (state, { payload }) => {
                    //         state.list?.push(payload)
                    //         state.count += 1
                    //         state.isLoading = null
                    //         state.error = null
                    //         console.log(`createEndpoint ${this.name} fulfilled`)
                    //     },
                    // )
                    // .addCase(
                    //     thunks.putEndpointThunk(this.name, this.service)
                    //         .fulfilled,
                    //     (state, { payload }) => {
                    //         state.list = state.list.map((item: any) =>
                    //             item.id === payload.id ? payload : item,
                    //         )
                    //         state.isLoading = null
                    //         state.error = null
                    //         console.log(`putEndpoint ${this.name} fulfilled`)
                    //         console.log(state.list)
                    //     },
                    // )
                    // .addCase(
                    //     thunks.deleteEndpointThunk(this.name, this.service)
                    //         .fulfilled,
                    //     (state, { payload }) => {
                    //         state.list = state.list.filter(
                    //             (item: any) => item.id !== payload.id,
                    //         )
                    //         state.isLoading = null
                    //         state.error = null
                    //         console.log(`deleteEndpoint ${this.name} fulfilled`)
                    //     },
                    // )
                    // matchers
                    .addMatcher(
                        isPending(thunks.headThunk(this.name, this.service)),
                        state => {
                            state.isLoading = 'head'
                            state.error = null
                            console.log(`${this.name} head pending`)
                        },
                    )
                    .addMatcher(
                        isPending(
                            thunks.fetchByIdThunk(this.name, this.service),
                            thunks.fetchByIdNestedThunk(
                                this.name,
                                this.service,
                            ),
                            // thunks.fetchEndpointByIdThunk(
                            //     this.name,
                            //     this.service,
                            // ),
                        ),
                        state => {
                            state.isLoading = 'single'
                            state.error = null
                            console.log(`${this.name} single pending`)
                        },
                    )
                    .addMatcher(
                        isPending(
                            thunks.fetchThunk(
                                this.name,
                                this.service,
                                this.validationSchema,
                            ),
                            thunks.fetchWithParamsThunk(
                                this.name,
                                this.service,
                            ),
                            thunks.createThunk(this.name, this.service),
                            thunks.putThunk(this.name, this.service),
                            thunks.patchThunk(this.name, this.service),
                            thunks.deleteThunk(this.name, this.service),
                            thunks.changeOffsetThunk(this.name),
                            thunks.changeOrderingThunk(this.name),
                            thunks.fetchWithParamsNestedThunk(
                                this.name,
                                this.service,
                            ),
                            thunks.createNestedThunk(this.name, this.service),
                            thunks.putNestedThunk(this.name, this.service),
                            thunks.patchNestedThunk(this.name, this.service),
                            thunks.deleteNestedThunk(this.name, this.service),
                            // thunks.fetchEndpointWithParamsThunk(
                            //     this.name,
                            //     this.service,
                            // ),
                            // thunks.createEndpointThunk(this.name, this.service),
                            // thunks.putEndpointThunk(this.name, this.service),
                            // thunks.deleteEndpointThunk(this.name, this.service),
                        ),
                        state => {
                            state.isLoading = 'list'
                            state.error = null
                            console.log(`${this.name} list pending`)
                        },
                    )
                    .addMatcher(
                        isRejected(thunks.headThunk(this.name, this.service)),
                        (state, action) => {
                            state.error = action.meta.aborted
                                ? 'aborted'
                                : action.payload
                            state.isLoading = action.meta.aborted
                                ? state.isLoading
                                : null
                            state.head = false
                        },
                    )
                    .addMatcher(
                        isRejected(
                            thunks.fetchThunk(
                                this.name,
                                this.service,
                                this.validationSchema,
                            ),
                            thunks.fetchByIdThunk(this.name, this.service),
                            thunks.fetchWithParamsThunk(
                                this.name,
                                this.service,
                            ),
                            thunks.createThunk(this.name, this.service),
                            thunks.putThunk(this.name, this.service),
                            thunks.patchThunk(this.name, this.service),
                            thunks.deleteThunk(this.name, this.service),
                            thunks.changeOffsetThunk(this.name),
                            thunks.changeOrderingThunk(this.name),
                            thunks.fetchWithParamsNestedThunk(
                                this.name,
                                this.service,
                            ),
                            thunks.createNestedThunk(this.name, this.service),
                            thunks.putNestedThunk(this.name, this.service),
                            thunks.patchNestedThunk(this.name, this.service),
                            thunks.deleteNestedThunk(this.name, this.service),
                            // thunks.fetchEndpointWithParamsThunk(
                            //     this.name,
                            //     this.service,
                            // ),
                            // thunks.createEndpointThunk(this.name, this.service),
                            // thunks.putEndpointThunk(this.name, this.service),
                            // thunks.deleteEndpointThunk(this.name, this.service),
                        ),
                        (state, action) => {
                            state.error = action.meta.aborted
                                ? 'aborted'
                                : action.payload
                            state.isLoading = action.meta.aborted
                                ? state.isLoading
                                : null

                            if (action.payload) {
                                toast.error(
                                    <ToastMessage
                                        name='Ошибка'
                                        desc={action.payload}
                                    />,
                                    {
                                        position: 'bottom-right',
                                        toastId: 'customIdRejected',
                                        theme: 'colored',
                                        autoClose: 10000,
                                    },
                                )
                            }
                            // console.error('rejected', action)
                        },
                    )
            },
        })
    }
}
