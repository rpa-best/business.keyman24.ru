import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import Select from 'react-select/async'
import { useDropzone } from 'react-dropzone'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/section.scss'
import { type IInventory, InventorySchema } from '../../models/inventory'
import {
    imageNestedInventoryReducer,
    inventoryReducer,
    inventoryTypeReducer,
} from '../../store'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import CheckBoxSwitch from '../CheckBoxSwitch'
import FormInput from '../FormInput'
import { IDataByMode } from '../../models/IFormData'
import getOptionsByArray from '../../helpers/getOptionsByArray'
import { selectStyles, themeUnset } from '../../config/selectStyles'
import { ReactComponent as SVGShare } from '../../assets/img/shared/share.svg'
import $api from '../../http'
import TableFiles from '../TableFiles'

interface FormInventoryProps {
    id: number
    title: string | null
    mode: string
}

const { VITE_API_URL } = import.meta.env

const FormInventory: FC<FormInventoryProps> = props => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { currentOrg } = useAppSelector(state => state.org)
    const goBack = () => navigate(`/${currentOrg.id}/inventory/`)

    const { id, title, mode } = props
    const fetchedInvTypes = useAppSelector(state => state.inventoryType.list)
    const fetchedImages = useAppSelector(
        state => state.imageNestedInventory.list,
    )
    const imagesLoading = useAppSelector(state => state.imageNestedInventory.isLoading) === 'list'

    const temp = getOptionsByArray(fetchedInvTypes, 'slug', 'name')

    // const handleSaveChanges = (elemId: number, body: Omit<IInventory, 'id'>) => {
    //     dispatch(
    //         InventoryReducer.put({
    //             elemId,
    //             ...body,
    //         }),
    //     )
    //     goBack()
    // }

    // const handleAddElement = (body: Omit<IInventory, 'id'>) => {
    //     dispatch(InventoryReducer.create(body))
    //     goBack()
    // }

    const dataByMode: IDataByMode<IInventory> = {
        edit: {
            formTitle: `${title} / Редактирование`,
            buttonTitle: 'Сохранить изменения',
            data: useAppSelector(state => state.inventory.single),
            // buttonAction: handleSaveChanges(id, formik.values),
        },
        create: {
            formTitle: `${title} / Добавление`,
            buttonTitle: 'Добавить инвентарь',
            data: {} as IInventory,
            // buttonAction: handleAddElement(formik.values),
        },
    }

    const getFormData = (key: string) => {
        return dataByMode[key]
    }

    const formData = getFormData(mode)

    const formik = useFormik({
        initialValues: {
            type: formData.data.type?.slug,
            // comments: formData.data.comments,
            // not_zone: formData.data.not_zone ?? false,
            number: formData.data.number,
            name: formData.data.name,
            desc: formData.data.desc,
            // code_image: formData.data.code_image,
            // is_active: formData.data.is_active ?? false,
            // location: formData.data.location,
            // object_area: formData.data.object_area,
        },
        validationSchema: InventorySchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                dispatch(inventoryReducer.put(values))
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
            inventoryReducer.patch({
                id,
                ...formik.values,
            }),
        )
        goBack()
    }

    const handleAddElement = () => {
        dispatch(inventoryReducer.create(formik.values))
        goBack()
    }

    const buttonAction = () =>
        (mode === 'edit' ? handleSaveChanges() : handleAddElement())

    // const [selectedFile, setSelectedFile] = useState<any>(null)
    // const [uploaded, setUploaded] = useState<any>()

    // const handleChange = (e: { target: { value: any, files: any } }) => {
    //     console.log(e.target.files)
    // }

    // const handleUpload = async () => {
    //     if (!selectedFile) {
    //         console.log('choose file')
    //     }
    // }

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

            const result = await $api.post(
                `business/${Number(
                    localStorage.getItem('currOrg'),
                )}/inventory/${id}/image/`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            dispatch(
                imageNestedInventoryReducer.fetchWithParamsNested({
                    id,
                    endpoint: 'image',
                    filter: 'image_size=small',
                }),
            )
        },
    })

    const getImageSrcFromBase64 = (base64String: string | null) => {
        if (typeof base64String !== 'string') return undefined

        const concatAttr = `data:image/png;base64,${base64String}`
        const binaryString = atob(concatAttr.split(',')[1])
        const blob = new Blob([binaryString], { type: 'image/png' })
        return URL.createObjectURL(blob)
    }

    return (
        <form onSubmit={formik.handleSubmit} autoComplete='off'>
            <fieldset disabled={formik.isSubmitting}>
                <h1>{formData.formTitle}</h1>

                {/* <FormInput
                    name='comments'
                    label='Комментарии'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.comments}
                />

                <CheckBoxSwitch
                    name='not_zone'
                    label='not_zone'
                    value={formik.values.not_zone}
                    onBlur={formik.handleBlur}
                    checked={formik.values.not_zone}
                    onChange={() =>
                        formik.setFieldValue(
                            'not_zone',
                            !formik.values.not_zone,
                        )
                    }
                /> */}

                <FormInput
                    name='name'
                    label='Имя инвентаря'
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

                <FormInput
                    name='number'
                    label='Номер'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={nullToEmptyString(formik.values.number)}
                />

                <div className='input-wrapper flex-column'>
                    <h3
                        className='h5'
                        style={{ color: 'var(--text-color-my)' }}
                    >
                        Тип инвентаря
                    </h3>
                    <Select
                        placeholder='выберите тип'
                        noOptionsMessage={() => 'name not found'}
                        styles={selectStyles}
                        defaultOptions={temp}
                        theme={theme => themeUnset(theme)}
                        name='type'
                        value={
                            (temp
                                ? temp.find(
                                    option =>
                                        option.value === formik.values.type,
                                )
                                : '') as any
                        }
                        onChange={e => formik.setFieldValue('type', e.value)}
                    />
                </div>

                {mode === 'edit' && (
                    <div className='images-wrapper row row-cols-4 row-cols-md-4'>
                        {imagesLoading ? (
                            <Spinner />
                        ) : (
                            fetchedImages.map(image => (
                                // <img alt='' key={image.id} src={VITE_API_URL.concat(image.image?.replace('/api/v1.1/', ''))} />
                                <div className='img-wrapper' key={image.id}>
                                    <img
                                        alt={image.image}
                                        src={VITE_API_URL.concat(
                                            image.image?.replace(
                                                '/api/v1.1/',
                                                '',
                                            ),
                                        )}
                                    />
                                    <button
                                        type='button'
                                        className='remove-image'
                                        onClick={() =>
                                            dispatch(
                                                imageNestedInventoryReducer.deleteNested(
                                                    image.id,
                                                    {
                                                        id,
                                                        endpoint: 'image',
                                                    },
                                                ),
                                            )}
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                        <div className='img-wrapper'>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <div className='content-wrapper'>
                                    <input
                                        className='input-zone'
                                        {...getInputProps()}
                                    />
                                    <div className='text-center'>
                                        <p className='dropzone-content'>
                                            Перетащите файл сюда или нажмите,
                                            чтобы выбрать файл
                                        </p>
                                        <SVGShare stroke='var(--text-color-my)' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* <input type='file' onChange={handleChange} />

                <button type='button' onClick={handleUpload}>
                    Upload
                </button>

                {selectedFile && (
                    <ul className='text-light'>
                        <li className='text-light'>Name: {selectedFile.name}</li>
                        <li className='text-light'>Type: {selectedFile.type}</li>
                        <li className='text-light'>Size: {selectedFile.size}</li>
                        <li className='text-light'>
                            lastModifiedDate:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </li>
                    </ul>
                )}

                {uploaded && (
                    <div>
                        <h2>{uploaded.filename}</h2>
                        <img alt='' src={uploaded.filePath} width='200' />
                    </div>
                )} */}

                {/* <FormInput
                    name='code_image'
                    label='Код изображения'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.code_image}
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

                <FormInput
                    name='location'
                    label='Локация'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.location}
                /> */}

                {/* {mode !== 'list' && (
                    <div className='img-wrapper'>
                        <img
                            src={getImageSrcFromBase64(formData.data.code_image)}
                            alt=''
                            width={100}
                            height={100}
                        />
                    </div>
                )} */}

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

const Inventory: FC = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { endpoint, id, mode } = loaderData
    const { reducer, callSelector, title } = getEntity(endpoint)

    useEffect(() => {
        const dispatchedThunk1 = dispatch(
            inventoryTypeReducer.fetchWithParams(),
        )
        const dispatchedThunk2 = mode === 'edit' && dispatch(reducer.fetchById(id))

        const dispatchedThunk3 = mode === 'edit'
            && dispatch(
                imageNestedInventoryReducer.fetchWithParamsNested({
                    id,
                    endpoint: 'image',
                    filter: 'image_size=medium',
                    // filter: 'image_size=small',
                    // filter: 'image_size=big',
                }),
            )

        return () => {
            dispatchedThunk1.abort()

            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk2 && dispatchedThunk2.abort()

            // eslint-disable-next-line no-unused-expressions
            mode === 'edit' && dispatchedThunk3 && dispatchedThunk3.abort()
        }
    }, [dispatch, id, mode, inventoryTypeReducer, reducer])

    if (callSelector().isLoading === 'single' && mode !== 'create') {
        return <Spinner />
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper' style={{ paddingBottom: '0px' }}>
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <FormInventory id={id} title={title} mode={mode} />
                    </div>
                </div>
            </div>
            {mode === 'edit' && (
                <div
                    className='display-flex w-100'
                    style={{ paddingBottom: '50px' }}
                >
                    <TableFiles inventoryType='inventory' />
                </div>
            )}
        </div>
    )
}

export default Inventory
