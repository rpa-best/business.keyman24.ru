import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import { type IWorker, WorkerSchema } from '../../models/worker'
import { permissionGroupReducer, workerReducer } from '../../store'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import ToastMessage from '../ToastMessage'
import { IBusinessUserCreateRequest } from '../../models/user'
import {
    createUser,
    fetchByIdUser,
    patchUser,
} from '../../store/slices/userSlice'
import { IDataByMode } from '../../models/IFormData'
import FormInput from '../FormInput'
import PickListPermissionGroupUser from '../PickList/PickListPermissionGroupUser'
import PickListPermissionUser from '../PickList/PickListPermissionUser'
import TableByEndpoint from '../TableByEndpoint/TableByEndpoint'
import FormInputRow from '../FormInputRow'
import Avatar from '../../assets/img/topnav/avatar.svg'
import $api from '../../http'
import PhotoPreload from '../PhotoPreload'

interface FormWorkerProps {
    id: number | null
    title: string | null
    mode: string
}

const FormWorker: FC<FormWorkerProps> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const goBack = () => navigate(`/${currentOrg.id}/worker/`)
    const user = useAppSelector(state => state.user.single)
    const dataUser = !user ? ({} as IBusinessUserCreateRequest) : user

    const { id, title, mode } = props

    const dataByMode: IDataByMode<IWorker> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(state => state.worker.single),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить пользователя',
            data: {} as IWorker,
            // buttonAction: handleAddElement(formik.values),
        },
    }

    const getFormData = (key: string) => {
        return dataByMode[key]
    }

    const formData = getFormData(mode)

    const formik = useFormik({
        initialValues: {
            name: formData.data.name,
            username: formData.data.user?.username,
            password1: '',
            password2: '',
            phone: dataUser?.phone,
        },
        validationSchema: WorkerSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                dispatch(workerReducer.patch(values))
            } catch (e) {
                console.log(e)
            }
            return setSubmitting(false)
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
    })

    const handleCreateUser = async () => {
        if (formik.values.password1 === formik.values.password2) {
            dispatch(
                createUser({
                    id,
                    data: {
                        username: formik.values.username,
                        password1: formik.values.password1,
                        password2: formik.values.password2,
                    },
                }),
            )
        } else {
            toast.warning(<ToastMessage name='Пароли не совпадают' desc='' />, {
                position: 'bottom-right',
                toastId: 'customId',
                theme: 'colored',
            })
        }
    }

    const handleSaveClick = () => {
        if (formData.data.user !== null) {
            dispatch(patchUser({ id, data: { phone: formik.values.phone } }))
        } else {
            handleCreateUser()
        }
        dispatch(
            workerReducer.patch({
                id,
                name: formik.values.name,
            }),
        )
        goBack()
    }

    const buttonAction = () => handleSaveClick()

    // console.log(11111, formData.data.user?.username)

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        multiple: false,
        async onDrop(files, fileRejections, event) {
            const data = new FormData()
            data.append('image', files[0])

            // dispatch(
            //     imageNestedInventoryReducer.createNested(
            //         {
            //             image: data,
            //         },
            //         {
            //             id,
            //             endpoint: 'image',
            //         },
            //     ),
            // )

            const result = await $api.patch(
                `business/${Number(
                    localStorage.getItem('currOrg'),
                )}/worker/${id}/`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            dispatch(workerReducer.fetchById(Number(id)))
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} autoComplete='off'>
            <fieldset disabled={formik.isSubmitting}>
                <h1>{formData.formTitle}</h1>

                <div className='d-flex justify-content-between h-100 align-items-center'>
                    <div className='form-image'>
                        <div className='img-wrapper'>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <div className='content-wrapper'>
                                    <input
                                        className='input-zone'
                                        {...getInputProps()}
                                    />
                                    {/* <img alt='worker_photo' src={formData.data.image ?? Avatar} /> */}
                                    <PhotoPreload
                                        image={formData.data.image ?? Avatar}
                                        preload={Avatar}
                                        alt='worker_photo'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex flex-column w-100 h-100'>
                        <FormInput
                            name='name'
                            label='Имя работника'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={nullToEmptyString(formik.values.name)}
                        />

                        <FormInput
                            name='phone'
                            label='Телефон'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={nullToEmptyString(formik.values.phone)}
                        />
                    </div>
                </div>

                {/* <FormInput
                    name='phone'
                    label='Телефон'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={nullToEmptyString(formik.values.phone)}
                /> */}

                {formData.data.user === null && (
                    <>
                        <FormInput
                            name='username'
                            label='Username'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={nullToEmptyString(formik.values.username)}
                        />
                        <div className='input-wrapper flex-column'>
                            <h3
                                className='h5'
                                style={{ color: 'var(--text-color-my)' }}
                            >
                                Пароль
                            </h3>
                            <input
                                name='password1'
                                type='password'
                                className='custom-input'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password1}
                            />
                        </div>
                        <div className='input-wrapper flex-column'>
                            <h3
                                className='h5'
                                style={{ color: 'var(--text-color-my)' }}
                            >
                                Подтверждение пароля
                            </h3>
                            <input
                                type='password'
                                name='password2'
                                className='custom-input'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password2}
                            />
                        </div>
                    </>
                )}

                <div className='input-buttons-wrapper'>
                    <Button
                        title={formData.buttonTitle}
                        handleClick={() => buttonAction()}
                    />
                    <Button
                        title='Вернуться'
                        handleClick={() => {
                            goBack()
                        }}
                    />
                </div>
            </fieldset>
        </form>
    )
}

export interface CustomTabsProps {
    id: number
}

const CustomTabs: FC<CustomTabsProps> = props => {
    const { id } = props
    const [currentTab, setCurrentTab] = useState('card-nested-worker')

    return (
        <div className='custom-tabs'>
            <div className='tabs-header-wrapper'>
                <ul className='nav nav-pills'>
                    <li className='nav-item'>
                        <button
                            type='button'
                            className={`nav-link ${
                                currentTab === 'card-nested-worker'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() => setCurrentTab('card-nested-worker')}
                        >
                            Выданные карты
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button
                            type='button'
                            className={`nav-link ${
                                currentTab === 'docs-nested-worker'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() => setCurrentTab('docs-nested-worker')}
                        >
                            Документы
                        </button>
                    </li>
                </ul>
            </div>
            <div className='tabs-content'>
                <TableByEndpoint endpoint={currentTab} id={id} />
            </div>
        </div>
    )
}

const Worker: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { endpoint, id, mode } = loaderData
    const { reducer, callSelector, title } = getEntity(endpoint)
    const userLoading = useAppSelector(state => state.user.isLoading)
    const user = useAppSelector(state => state.user)
    // const [dispatchedThunks, setDispatchedThunks] = useState<any[]>([])
    // const [isDispatching, setIsDispatching] = useState(true)

    // const getData = async () => {
    //     if (mode !== 'edit') {
    //         setDispatchedThunks([])
    //         setIsDispatching(false)
    //         return
    //     }
    //     const dispatchedThunk1 = dispatch(workerReducer.fetchById(id))
    //     const result = await dispatchedThunk1.unwrap()
    //     // console.log(111, typeof result.user.username !== typeof 'string')

    //     if (typeof result.user.username !== typeof 'string') {
    //         setDispatchedThunks([dispatchedThunk1])
    //         setIsDispatching(false)
    //         return
    //     }
    //     // console.log(typeof result.user.username !== typeof String)

    //     const dispatchedThunk2 = dispatch(fetchByIdUser(id))
    //     setDispatchedThunks(prev => [
    //         ...prev,
    //         dispatchedThunk1,
    //         dispatchedThunk2,
    //     ])
    //     setIsDispatching(false)
    // }
    // const abortController = new AbortController()

    // useEffect(() => {
    //     getData()

    //     return () => {
    //         if (abortController) {
    //             abortController.abort()
    //         }

    // dispatchedThunks.forEach(thunk => {
    //     if (thunk.abort) {
    //         thunk.abort()
    //     }
    // })
    //     }
    // }, [dispatch, id, mode, reducer])

    // useEffect(() => {
    //     // Update dispatchedThunks whenever it changes
    //     console.log('dispatchedThunks updated:', dispatchedThunks)
    // }, [dispatchedThunks])

    useEffect(() => {
        const dispatchedThunk1 = mode === 'edit' && dispatch(reducer.fetchById(id))

        const dispatchedThunk2 = mode === 'edit' && dispatch(fetchByIdUser(id))

        return () => {
            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk1 && dispatchedThunk1.abort()

            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk2 && dispatchedThunk2.abort()
        }
    }, [dispatch, id, mode, reducer])

    if (
        (callSelector().isLoading === 'single' || userLoading === 'single')
        && mode !== 'create'
    ) {
        return <Spinner />
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper'>
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <FormWorker id={id} title={title} mode={mode} />
                    </div>
                </div>
            </div>
            {mode === 'edit' && user.single.username !== undefined && (
                <>
                    <div
                        className='default-wrapper'
                        style={{ paddingTop: '0px' }}
                    >
                        <PickListPermissionUser
                            username={user.single.username}
                        />
                    </div>
                    <div
                        className='default-wrapper'
                        style={{ paddingTop: '0px' }}
                    >
                        <PickListPermissionGroupUser
                            username={user.single.username}
                        />
                    </div>
                </>
            )}
            {mode === 'edit' && (
                <div
                    className='default-wrapper'
                    style={{ paddingTop: '0px', paddingBottom: '50px' }}
                >
                    <CustomTabs id={Number(id)} />
                </div>
            )}
        </div>
    )
}

export default Worker
