import React from 'react'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { z, ZodError } from 'zod'
import { toast } from 'react-toastify'
import IQueryParams from '../models/IQueryParams'
import IService from '../models/IService'
import ISubListQueryParams from '../models/ISubListQueryParams'
import ToastMessage from '../components/ToastMessage'
// import primitives from '../models/primitives'

// interface DefaultArrayResponse<Data> {
//     count: z.infer<typeof primitives.integer>
//     results: Data[]
// }

const fetchThunk = <Model extends z.AnyZodObject>(
    name: string,
    service: IService,
    validationSchema: Model,
) =>
    createAsyncThunk<any, undefined, { rejectValue: any }>(
        `${name}/fetch${name}`,
        async (_, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.fetch(controller.signal)

                if (response.status !== 200) {
                    throw new Error(`Failed to fetch ${name}`)
                }

                // validationSchema.array().parse(response.data.results)

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

const fetchByIdThunk = (name: string, service: IService) =>
    createAsyncThunk<any, number, { rejectValue: any }>(
        `${name}/fetchById${name}`,
        async (data: number, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.fetchById(
                    data,
                    controller.signal,
                )

                if (response.status !== 200) {
                    throw new Error(`Failed to fetchById ${name}`)
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

const fetchWithParamsThunk = (name: string, service: IService) =>
    createAsyncThunk<any, IQueryParams, { rejectValue: any }>(
        `${name}/fetchWithParams${name}`,
        async (data: IQueryParams, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.fetchWithParams(
                    data,
                    controller.signal,
                )

                if (response && response.status && response.status !== 200) {
                    throw new Error(`Failed to fetchWithParams ${name}`)
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

const createThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/create${name}`,
        async (data: any, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.create(data, controller.signal)

                if (response.status !== 201) {
                    throw new Error(`Failed to create ${name}`)
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

const putThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/put${name}`,
        async (data: any, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.put(data, controller.signal)

                if (response.status !== 200) {
                    throw new Error(`Failed to put ${name}`)
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

const patchThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/patch${name}`,
        async (data: any, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.patch(data, controller.signal)

                if (response.status !== 200) {
                    throw new Error(`Failed to patch ${name}`)
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

const deleteThunk = (name: string, service: IService) =>
    createAsyncThunk<any, number, { rejectValue: any }>(
        `${name}/delete${name}`,
        async (data: number, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.delete(data, controller.signal)

                if (response.status !== 204) {
                    throw new Error(`Failed to delete ${name}`)
                }

                return data
            } catch (error) {
                if (error instanceof AxiosError) {
                    return thunkApi.rejectWithValue(error.message)
                }

                return thunkApi.rejectWithValue(error)
            }
        },
    )

const headThunk = (name: string, service: IService) =>
    createAsyncThunk<any, undefined, { rejectValue: any }>(
        `${name}/head${name}`,
        async (_, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.head(controller.signal)

                if (response.status !== 200) {
                    throw new Error(`Failed to head ${name}`)
                }

                // console.log(response.headers.authorization)

                return response.status === 200
            } catch (error) {
                if (error instanceof AxiosError) {
                    return thunkApi.rejectWithValue(error.message)
                }

                return thunkApi.rejectWithValue(error)
            }
        },
    )

const clearSingleThunk = (name: string) =>
    createAsyncThunk<any, undefined, { rejectValue: any }>(
        `${name}/clearSingle${name}`,
        async (_, thunkApi) => {
            return thunkApi.getState()
        },
    )

const changeOffsetThunk = (name: string) =>
    createAsyncThunk<any, number, { rejectValue: any }>(
        `${name}/changeOffset${name}`,
        async (data: number) => data,
    )

const changeOrderingThunk = (name: string) =>
    createAsyncThunk<any, string, { rejectValue: any }>(
        `${name}/changeOrdering${name}`,
        async (data: string) => data,
    )

// nested entity
const fetchByIdNestedThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/fetchByIdNested${name}`,
        async (data: { id: number; params: ISubListQueryParams }, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.fetchByIdNested(
                    data.id,
                    data.params,
                    controller.signal,
                )

                if (response.status !== 200) {
                    throw new Error(`Failed to fetchByIdNested ${name}`)
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

const fetchWithParamsNestedThunk = (name: string, service: IService) =>
    createAsyncThunk<any, ISubListQueryParams, { rejectValue: any }>(
        `${name}/fetchWithParamsNested${name}`,
        async (data: ISubListQueryParams, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.fetchWithParamsNested(
                    data,
                    controller.signal,
                )

                if (response.status !== 200) {
                    throw new Error(`Failed to fetchWithParamsNested ${name}`)
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

const createNestedThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/createNested${name}`,
        async (data: { data: any; params: ISubListQueryParams }, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.createNested(
                    data.data,
                    data.params,
                    controller.signal,
                )

                if (response.status !== 201) {
                    throw new Error(`Failed to createNested ${name}`)
                }

                return response.data
            } catch (error) {
                if (error instanceof AxiosError) {
                    // toast.error(
                    //     <ToastMessage
                    //         name='Ошибка'
                    //         desc={(error.response as any).data.message.desc}
                    //     />,
                    //     {
                    //         position: 'bottom-right',
                    //         toastId: 'customIdRejected',
                    //         theme: 'colored',
                    //         autoClose: 10000,
                    //     },
                    // )
                    return thunkApi.rejectWithValue(error.message)
                }

                return thunkApi.rejectWithValue(error)
            }
        },
    )

const putNestedThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/putNested${name}`,
        async (data: { data: any; params: ISubListQueryParams }, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.putNested(
                    data.data,
                    data.params,
                    controller.signal,
                )

                if (response.status !== 200) {
                    throw new Error(`Failed to putNested ${name}`)
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

const patchNestedThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/patchNested${name}`,
        async (data: { data: any; params: ISubListQueryParams }, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.patchNested(
                    data.data,
                    data.params,
                    controller.signal,
                )

                if (response.status !== 200) {
                    throw new Error(`Failed to patchNested ${name}`)
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

const deleteNestedThunk = (name: string, service: IService) =>
    createAsyncThunk<any, any, { rejectValue: any }>(
        `${name}/deleteNested${name}`,
        async (data: { id: number; params: ISubListQueryParams }, thunkApi) => {
            try {
                const controller = new AbortController()
                thunkApi.signal.addEventListener('abort', () =>
                    controller.abort(),
                )

                const response = await service.deleteNested(
                    data.id,
                    data.params,
                    controller.signal,
                )

                if (response.status !== 204) {
                    throw new Error(`Failed to delete ${name}`)
                }

                return data
            } catch (error) {
                if (error instanceof AxiosError) {
                    return thunkApi.rejectWithValue(error.message)
                }

                return thunkApi.rejectWithValue(error)
            }
        },
    )

// free endpoint
// const fetchEndpointByIdThunk = (name: string, service: IService) =>
//     createAsyncThunk<any, any, { rejectValue: any }>(
//         `${name}/fetchEndpointById${name}`,
//         async (data: { id: number; params: ISubListQueryParams }, thunkApi) => {
//             try {
//                 const response = await service.fetchEndpointById(
//                     data.id,
//                     data.params,
//                 )

//                 if (response.status !== 200) {
//                     throw new Error(`Failed to fetchEndpointById ${name}`)
//                 }

//                 return response.data
//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     return thunkApi.rejectWithValue(error.message)
//                 }

//                 return thunkApi.rejectWithValue(error)
//             }
//         },
//     )

// const fetchEndpointWithParamsThunk = (name: string, service: IService) =>
//     createAsyncThunk<any, ISubListQueryParams, { rejectValue: any }>(
//         `${name}/fetchEndpointWithParams${name}`,
//         async (data: ISubListQueryParams, thunkApi) => {
//             try {
//                 const response = await service.fetchEndpointWithParams(data)

//                 if (response.status !== 200) {
//                     throw new Error(`Failed to fetchEndpointWithParams ${name}`)
//                 }

//                 return response.data
//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     return thunkApi.rejectWithValue(error.message)
//                 }

//                 return thunkApi.rejectWithValue(error)
//             }
//         },
//     )

// const createEndpointThunk = (name: string, service: IService) =>
//     createAsyncThunk<any, any, { rejectValue: any }>(
//         `${name}/createEndpoint${name}`,
//         async (data: ISubListQueryParams, thunkApi) => {
//             try {
//                 const response = await service.createEndpoint(data)

//                 if (response.status !== 201) {
//                     throw new Error(`Failed to createEndpoint ${name}`)
//                 }

//                 return response.data
//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     return thunkApi.rejectWithValue(error.message)
//                 }

//                 return thunkApi.rejectWithValue(error)
//             }
//         },
//     )

// const putEndpointThunk = (name: string, service: IService) =>
//     createAsyncThunk<any, any, { rejectValue: any }>(
//         `${name}/putEndpoint${name}`,
//         async (data: ISubListQueryParams, thunkApi) => {
//             try {
//                 const response = await service.putEndpoint(data)

//                 if (response.status !== 200) {
//                     throw new Error(`Failed to putEndpoint ${name}`)
//                 }

//                 return response.data
//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     return thunkApi.rejectWithValue(error.message)
//                 }

//                 return thunkApi.rejectWithValue(error)
//             }
//         },
//     )

// const deleteEndpointThunk = (name: string, service: IService) =>
//     createAsyncThunk<any, any, { rejectValue: any }>(
//         `${name}/deleteEndpoint${name}`,
//         async (data: { id: number; params: ISubListQueryParams }, thunkApi) => {
//             try {
//                 const response = await service.deleteEndpoint(
//                     data.id,
//                     data.params,
//                 )

//                 if (response.status !== 204) {
//                     throw new Error(`Failed to delete ${name}`)
//                 }

//                 return data
//             } catch (error) {
//                 if (error instanceof AxiosError) {
//                     return thunkApi.rejectWithValue(error.message)
//                 }

//                 return thunkApi.rejectWithValue(error)
//             }
//         },
//     )

export default {
    fetchThunk,
    fetchByIdThunk,
    fetchWithParamsThunk,
    createThunk,
    putThunk,
    patchThunk,
    deleteThunk,
    headThunk,
    clearSingleThunk,
    changeOffsetThunk,
    changeOrderingThunk,
    fetchByIdNestedThunk,
    fetchWithParamsNestedThunk,
    createNestedThunk,
    putNestedThunk,
    patchNestedThunk,
    deleteNestedThunk,
    // fetchEndpointByIdThunk,
    // fetchEndpointWithParamsThunk,
    // createEndpointThunk,
    // putEndpointThunk,
    // deleteEndpointThunk,
}
