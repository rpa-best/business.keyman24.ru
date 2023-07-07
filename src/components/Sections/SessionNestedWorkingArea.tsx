import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import {
    type IWorkingAreaSession,
    WorkingAreaSessionSchema,
} from '../../models/workingAreaSession'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import FormInput from '../FormInput'
import { IDataByMode } from '../../models/IFormData'

interface FormSessionNestedWorkingAreaProps {
    id: number
    mode: string
    endpoint: string
    extraId: number
}

const FormSessionNestedWorkingArea: FC<
    FormSessionNestedWorkingAreaProps
> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const {
        id, mode, endpoint, extraId,
    } = props
    const {
        reducer, title, endpointOriginal, endpointNested,
    } = getEntity(endpoint)

    const goBack = () =>
        navigate(
            `/${currentOrg.id}/${endpointOriginal}/${id}/edit/${endpointNested}/`,
        )

    const dataByMode: IDataByMode<IWorkingAreaSession> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(
                state => state.sessionNestedWorkingArea.single,
            ),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить сессию',
            data: {} as IWorkingAreaSession,
            // buttonAction: handleAddElement(formik.values),
        },
    }

    const getFormData = (key: string) => {
        return dataByMode[key]
    }

    const formData = getFormData(mode)

    const formik = useFormik({
        initialValues: {
            number: formData.data.number,
            end_date: formData.data.end_date,
            status: formData.data.status,
            user: formData.data.user?.username,
        },
        validationSchema: WorkingAreaSessionSchema,
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
        (mode === 'edit' ? handleSaveChanges() : handleAddElement())

    return (
        <form onSubmit={formik.handleSubmit} autoComplete='off'>
            <fieldset disabled={formik.isSubmitting}>
                <h1>{formData.formTitle}</h1>

                <FormInput
                    name='end_date'
                    label='Дата конца'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={nullToEmptyString(formik.values.end_date)}
                />

                {/* <FormInput
                    name='number'
                    label='Описание'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.number}
                /> */}

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

const SessionNestedWorkingArea: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const {
        id, mode, endpointOriginal, endpointNested, extraId,
    } = loaderData

    const { reducer, callSelector } = getEntity(
        `${endpointNested}-nested-${endpointOriginal}`,
    )

    useEffect(() => {
        // const dispatchedThunk1 = dispatch(user.fetch())
        const dispatchedThunk2 = mode === 'edit'
            && dispatch(
                reducer.fetchByIdNested(extraId, {
                    id,
                    endpoint: endpointNested,
                }),
            )
        return () => {
            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk2 && dispatchedThunk2.abort()
        }
    }, [mode, extraId, id, endpointNested, dispatch])

    if (callSelector().isLoading === 'single' && mode !== 'create') {
        return <Spinner />
    }

    return (
        // <div className='outlet-wrapper flex-column'>
        //     <div className='default-wrapper'>
        //         <div className='section-wrapper'>
        //             <div className='section-content'>
        //                 <FormSessionNestedWorkingArea
        //                     id={id}
        //                     mode={mode}
        //                     endpoint={`${endpointNested}-nested-${endpointOriginal}`}
        //                     extraId={extraId}
        //                 />
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className='outlet-wrapper flex-column'>
            <h1 className='h1' style={{ color: 'var(--text-color-my)' }}>
                Приложите карту к устройству
            </h1>
        </div>
    )
}

export default SessionNestedWorkingArea
