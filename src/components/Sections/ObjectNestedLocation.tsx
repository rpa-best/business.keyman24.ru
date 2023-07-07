import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import {
    type ILocationObject,
    LocationObjectSchema,
} from '../../models/location'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import FormInput from '../FormInput'
import { IDataByMode } from '../../models/IFormData'
import TableFiles from '../TableFiles'

interface FormObjectNestedLocationProps {
    id: number
    mode: string
    endpoint: string
    extraId: number
}

const FormObjectNestedLocation: FC<FormObjectNestedLocationProps> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const { id, mode, endpoint, extraId } = props
    const { reducer, title, endpointOriginal, endpointNested } =
        getEntity(endpoint)

    const goBack = () =>
        navigate(
            `/${currentOrg.id}/${endpointOriginal}/${id}/edit/${endpointNested}/`,
        )

    const dataByMode: IDataByMode<ILocationObject> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(state => state.objectNestedLocation.single),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить объект локации',
            data: {} as ILocationObject,
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
            deleted: formData.data.deleted ?? false,
            location: id,
        },
        validationSchema: LocationObjectSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                // dispatch(
                //     reducer.putNested(values, {
                //         id: extraId,
                //         endpoint: String(endpointNested),
                //     }),
                // )
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
            reducer.patchNested(
                {
                    id: extraId,
                    ...formik.values,
                },
                {
                    id,
                    endpoint: String(endpointNested),
                },
            ),
        )
        goBack()
    }

    const handleAddElement = () => {
        dispatch(
            reducer.createNested(formik.values, {
                id,
                endpoint: String(endpointNested),
            }),
        )
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

const ObjectNestedLocation: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { id, mode, endpointOriginal, endpointNested, extraId } = loaderData

    const { reducer, callSelector } = getEntity(
        `${endpointNested}-nested-${endpointOriginal}`,
    )

    useEffect(() => {
        const dispatchedThunk =
            mode === 'edit' &&
            dispatch(
                reducer.fetchByIdNested(extraId, {
                    id,
                    endpoint: endpointNested,
                }),
            )
        return () => {
            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk && dispatchedThunk.abort()
        }
    }, [mode, extraId, id, endpointNested, dispatch])

    if (callSelector().isLoading === 'single' && mode !== 'create') {
        return <Spinner />
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper' style={{ paddingBottom: '0px' }}>
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <FormObjectNestedLocation
                            id={id}
                            mode={mode}
                            endpoint={`${endpointNested}-nested-${endpointOriginal}`}
                            extraId={extraId}
                        />
                    </div>
                </div>
            </div>
            {mode === 'edit' && (
                <div
                    className='display-flex w-100'
                    style={{ paddingBottom: '50px' }}
                >
                    <TableFiles inventoryType='key' />
                </div>
            )}
        </div>
    )
}

export default ObjectNestedLocation
