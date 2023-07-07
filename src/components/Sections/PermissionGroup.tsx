import React, { FC, useEffect } from 'react'
import Select from 'react-select/async'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { selectStyles, themeUnset } from '../../config/selectStyles'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { permissionGroupReducer, permissionLevelReducer } from '../../store'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import {
    type IPermissionGroup,
    PermissionGroupSchema,
} from '../../models/permission'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import getOptionsByArray from '../../helpers/getOptionsByArray'
import PickListPermission from '../PickList/PickListPermission'
import { IDataByMode } from '../../models/IFormData'
import FormInput from '../FormInput'

interface FormPermGroupProps {
    id: number | null
    title: string | null
    mode: string
}

const FormPermGroup: FC<FormPermGroupProps> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const goBack = () => navigate(`/${currentOrg.id}/permission-group/`)

    const { id, title, mode } = props
    const fetchedPermLevels = useAppSelector(
        state => state.permissionLevel.list,
    )

    const temp = getOptionsByArray(fetchedPermLevels, 'id', 'name')

    const dataByMode: IDataByMode<IPermissionGroup> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(state => state.permissionGroup.single),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить право доступа',
            data: {} as IPermissionGroup,
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
            level: formData.data.level?.id,
        },
        validationSchema: PermissionGroupSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                dispatch(permissionGroupReducer.put(values))
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
            permissionGroupReducer.put({
                id,
                ...formik.values,
            }),
        )
        goBack()
    }

    const handleAddElement = () => {
        dispatch(permissionGroupReducer.create(formik.values))
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
                    label='Имя группы права доступа'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />

                <div className='input-wrapper flex-column'>
                    <h3
                        className='h5'
                        style={{ color: 'var(--text-color-my)' }}
                    >
                        Уровень права доступа
                    </h3>
                    <Select
                        placeholder='выберите уровень'
                        noOptionsMessage={() => 'name not found'}
                        styles={selectStyles}
                        defaultOptions={temp}
                        theme={theme => themeUnset(theme)}
                        name='level'
                        value={
                            (temp
                                ? temp.find(
                                      option =>
                                          option.value === formik.values.level,
                                  )
                                : '') as any
                        }
                        onChange={e => formik.setFieldValue('level', e.value)}
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

const PermissionGroup: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { endpoint, id, mode } = loaderData
    const { reducer, callSelector, title } = getEntity(endpoint)

    useEffect(() => {
        const dispatchedThunk1 = dispatch(permissionLevelReducer.fetch())
        const dispatchedThunk2 =
            mode === 'edit' && dispatch(reducer.fetchById(id))

        return () => {
            dispatchedThunk1.abort()
            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk2 && dispatchedThunk2.abort()
        }
    }, [dispatch, id, mode, permissionLevelReducer, reducer])

    if (callSelector().isLoading === 'single' && mode !== 'create') {
        return <Spinner />
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper'>
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <FormPermGroup id={id} title={title} mode={mode} />
                    </div>
                </div>
            </div>
            {mode === 'edit' && (
                <div
                    className='default-wrapper'
                    style={{ paddingTop: '0px', paddingBottom: '50px' }}
                >
                    <PickListPermission id={id} />
                </div>
            )}
        </div>
    )
}

export default PermissionGroup
