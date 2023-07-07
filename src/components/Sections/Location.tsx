import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import { type ILocation, LocationSchema } from '../../models/location'
import { locationReducer } from '../../store'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import TableByEndpoint from '../TableByEndpoint/TableByEndpoint'
import CheckBoxSwitch from '../CheckBoxSwitch'
import FormInput from '../FormInput'
import { IDataByMode } from '../../models/IFormData'
import PickListOrgLocation from '../PickList/PickListOrgLocation'
import PickListWorkerLocation from '../PickList/PickListWorkerLocation'
import TestHeaders from './TestHeaders'

interface FormLocationProps {
    id: number
    title: string | null
    mode: string
}

const FormLocation: FC<FormLocationProps> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const goBack = () => navigate(`/${currentOrg.id}/location/`)

    const { id, title, mode } = props

    // const handleSaveChanges = (elemId: number, body: Omit<ILocation, 'id'>) => {
    //     dispatch(
    //         locationReducer.put({
    //             elemId,
    //             ...body,
    //         }),
    //     )
    //     goBack()
    // }

    // const handleAddElement = (body: Omit<ILocation, 'id'>) => {
    //     dispatch(locationReducer.create(body))
    //     goBack()
    // }

    const dataByMode: IDataByMode<ILocation> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(state => state.location.single),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить локацию',
            data: {} as ILocation,
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
            desc: formData.data.desc,
            is_active: formData.data.is_active ?? false,
            deleted: formData.data.deleted ?? false,
        },
        validationSchema: LocationSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                dispatch(locationReducer.put(values))
            } catch (e) {
                console.log(e)
            }
            return setSubmitting(false)
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
    })

    const handleSaveChanges = () => {
        dispatch(
            locationReducer.put({
                id,
                ...formik.values,
            }),
        )
        goBack()
    }

    const handleAddElement = () => {
        dispatch(locationReducer.create(formik.values))
        goBack()
    }

    const buttonAction = () =>
        mode === 'edit' ? handleSaveChanges() : handleAddElement()

    return (
        <form onSubmit={formik.handleSubmit} autoComplete='off'>
            <fieldset disabled={formik.isSubmitting}>
                <h1>{formData.formTitle}</h1>

                <FormInput
                    name='name'
                    label='Имя локации'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />

                <FormInput
                    name='desc'
                    label='Описание'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={nullToEmptyString(formik.values.desc)}
                />

                <CheckBoxSwitch
                    name='Активен'
                    label='is_active'
                    value={formik.values.is_active}
                    onBlur={formik.handleBlur}
                    checked={formik.values.is_active}
                    onChange={() =>
                        formik.setFieldValue(
                            'is_active',
                            !formik.values.is_active,
                        )
                    }
                />

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
    const [currentTab, setCurrentTab] = useState('object-nested-location')

    return (
        <div className='custom-tabs'>
            <div className='tabs-header-wrapper'>
                <ul className='nav nav-pills'>
                    <li className='nav-item'>
                        <button
                            type='button'
                            className={`nav-link ${
                                currentTab === 'object-nested-location'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setCurrentTab('object-nested-location')
                            }
                        >
                            Объекты
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

const Location: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { endpoint, id, mode } = loaderData
    const { reducer, callSelector, title } = getEntity(endpoint)
    const location = useAppSelector(state => state.location)
    const [refetch, setRefetch] = useState<boolean>(false)

    useEffect(() => {
        // fetch('https://jsonplaceholder.typicode.com/todos/1', {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem('token-access')}`,
        //     },
        // })
        //     .then(response => {
        //         // const headers = response.headers
        //         // response.headers.forEach((value, name) => {
        //         //     console.log(`${name}: ${value}`)
        //         // })
        //         console.warn('HEADERS', [...Array.from(response.headers.entries())])
        //         // console.warn('HEADERS', response.headers.get('Has-Permissions'))
        //         // console.warn('HEADERS', response.headers.has('has-permissions'))
        //         // console.warn('HEADERS', response.headers.has('Authorization'))
        //     })
        //     .catch(error => {
        //         console.error(error)
        //     })

        // const xhr = new XMLHttpRequest()
        // xhr.open('HEAD', 'https://py.keyman24.ru/api/v1.1/business/42/device/')
        // xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token-access')}`);
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        //         const headers = xhr.getAllResponseHeaders()
        //         console.log(headers)
        //     }
        // }
        // xhr.send()

        const dispatchedThunk =
            mode === 'edit' && dispatch(reducer.fetchById(id))

        return () => {
            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk && dispatchedThunk.abort()
        }
    }, [dispatch, id, mode, reducer])

    if (callSelector().isLoading === 'single' && mode !== 'create') {
        return <Spinner />
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper'>
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <FormLocation id={id} title={title} mode={mode} />
                    </div>
                </div>
            </div>
            {mode === 'edit' && location.single.id !== undefined && (
                <>
                    <div
                        className='default-wrapper'
                        style={{ paddingTop: '0px' }}
                    >
                        <PickListOrgLocation
                            locationId={location.single.id}
                            handleRefetch={() => setRefetch(prev => !prev)}
                        />
                    </div>
                    <div
                        className='default-wrapper'
                        style={{ paddingTop: '0px', paddingBottom: '50px' }}
                    >
                        <PickListWorkerLocation
                            locationId={location.single.id}
                            refetch={refetch}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default Location
