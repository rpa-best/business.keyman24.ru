import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import Select from 'react-select/async'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import { type IWorkingArea, WorkingAreaSchema } from '../../models/workingArea'
import {
    locationReducer,
    workingAreaReducer,
    workingAreaTypeReducer,
} from '../../store'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import CheckBoxSwitch from '../CheckBoxSwitch'
import FormInput from '../FormInput'
import { IDataByMode } from '../../models/IFormData'
import { selectStyles, themeUnset } from '../../config/selectStyles'
import getOptionsByArray from '../../helpers/getOptionsByArray'
import PickListDevice from '../PickList/PickListDevice'

interface FormWorkingAreaProps {
    id: number
    title: string | null
    mode: string
}

const FormWorkingArea: FC<FormWorkingAreaProps> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const goBack = () => navigate(`/${currentOrg.id}/working-area/`)

    const { id, title, mode } = props

    const fetchedAreaTypes = useAppSelector(state => state.workingAreaType.list)
    const typeOptions = getOptionsByArray(fetchedAreaTypes, 'slug', 'name')

    const fetchedLocations = useAppSelector(state => state.location.list)
    const locationOptions = getOptionsByArray(fetchedLocations, 'id', 'name')

    const dataByMode: IDataByMode<IWorkingArea> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(state => state.workingArea.single),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить рабочее место',
            data: {} as IWorkingArea,
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
            location: formData.data.location?.id,
            type: formData.data.type?.slug,
        },
        validationSchema: WorkingAreaSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                dispatch(workingAreaReducer.put(values))
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
            workingAreaReducer.patch({
                id,
                ...formik.values,
            }),
        )
        goBack()
    }

    const handleAddElement = () => {
        dispatch(
            workingAreaReducer.create({ ...formik.values, deleted: false }),
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
                    name='name'
                    label='Имя рабочего места'
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

                <div className='input-wrapper flex-column'>
                    <h3
                        className='h5'
                        style={{ color: 'var(--text-color-my)' }}
                    >
                        Локация
                    </h3>
                    <Select
                        placeholder='выберите локацию'
                        noOptionsMessage={() => 'name not found'}
                        styles={selectStyles}
                        defaultOptions={locationOptions}
                        theme={theme => themeUnset(theme)}
                        name='location'
                        value={
                            (locationOptions
                                ? locationOptions.find(
                                    option =>
                                        option.value
                                          === formik.values.location,
                                )
                                : '') as any
                        }
                        onChange={e =>
                            formik.setFieldValue('location', e.value)}
                    />
                </div>

                <div className='input-wrapper flex-column'>
                    <h3
                        className='h5'
                        style={{ color: 'var(--text-color-my)' }}
                    >
                        Тип рабочего места
                    </h3>
                    <Select
                        placeholder='выберите тип'
                        noOptionsMessage={() => 'name not found'}
                        styles={selectStyles}
                        defaultOptions={typeOptions}
                        theme={theme => themeUnset(theme)}
                        name='type'
                        value={
                            (typeOptions
                                ? typeOptions.find(
                                    option =>
                                        option.value === formik.values.type,
                                )
                                : '') as any
                        }
                        onChange={e => formik.setFieldValue('type', e.value)}
                    />
                </div>

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

const WorkingArea: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { endpoint, id, mode } = loaderData
    const { reducer, callSelector, title } = getEntity(endpoint)
    const workingAreaLoading = useAppSelector(
        state => state.workingArea.isLoading,
    )
    const workingArea = useAppSelector(state => state.workingArea)

    useEffect(() => {
        const dispatchedThunk1 = dispatch(workingAreaTypeReducer.fetch())
        const dispatchedThunk2 = dispatch(
            locationReducer.fetchWithParams({ filter: 'deleted=false' }),
        )
        const dispatchedThunk3 = mode === 'edit' && dispatch(reducer.fetchById(id))

        return () => {
            dispatchedThunk1.abort()
            dispatchedThunk2.abort()

            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk3 && dispatchedThunk3.abort()
        }
    }, [dispatch, id, mode, reducer])

    if (
        (callSelector().isLoading === 'single'
            || workingAreaLoading === 'single')
        && mode !== 'create'
    ) {
        return <Spinner />
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper'>
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <FormWorkingArea id={id} title={title} mode={mode} />
                    </div>
                </div>
            </div>
            {mode === 'edit' && workingArea.single.id !== undefined && (
                <div className='default-wrapper' style={{ paddingTop: '0px', paddingBottom: '50px' }}>
                    <PickListDevice workingAreaId={workingArea.single.id} />
                </div>
            )}
        </div>
    )
}

export default WorkingArea
