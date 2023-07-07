/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Select from 'react-select/async'
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap'
import ToastMessage from '../ToastMessage'
import { ReactComponent as SVGDownload } from '../../assets/img/shared/download.svg'
import { inventoryTypeReducer, inventoryUploadReducer } from '../../store'
import $api from '../../http'
import { ReactComponent as SVGDelete } from '../../assets/img/table/delete.svg'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import { fileSelectStyles, themeUnset } from '../../config/selectStyles'
import getOptionsByArray from '../../helpers/getOptionsByArray'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Spinner from '../Spinner/Spinner'

interface SelectOptions {
    value: string
    label: string
}

interface FilesModalProps {
    handleClose: () => void
}

const ModalFiles: FC<FilesModalProps> = props => {
    const { handleClose } = props
    const dispatch = useAppDispatch()
    const fetchedFiles = useAppSelector(state => state.inventoryUpload)
    const fetchedTypes = useAppSelector(state => state.inventoryType)
    const [currType, setCurrType] = useState<string | null>(null)

    const opts = getOptionsByArray(fetchedTypes.list, 'slug', 'name')

    const filterOptions = (inputValue: string): SelectOptions[] => {
        return fetchedTypes.list.map(item => {
            return {
                value: item.slug,
                label: item.name,
            }
        })
    }

    const loadOrgs = (
        inputValue: string,
        callback: (options: SelectOptions[]) => void,
    ) => {
        setTimeout(() => {
            if (inputValue) {
                // dispatch(fetchByNameOrg(inputValue))
                callback(filterOptions(inputValue))
            }
        }, 500)
    }

    useEffect(() => {
        const dispatchedThunk1 = dispatch(
            inventoryUploadReducer.fetchWithParams(),
        )

        const dispatchedThunk2 = dispatch(
            inventoryTypeReducer.fetchWithParams(),
        )

        return () => {
            dispatchedThunk1.abort()
            dispatchedThunk2.abort()
        }
    }, [])

    const checkType = () => {
        if (currType === null) {
            toast.error(
                <ToastMessage name='Ошибка' desc='Выберите тип инвентаря' />,
                {
                    position: 'bottom-right',
                    toastId: 'customIdFileError',
                    theme: 'colored',
                    autoClose: 5000,
                },
            )
            return false
        }

        return true
    }

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        multiple: false,
        // onDragEnter() {
        //     return checkType()
        // },
        // onFileDialogOpen() {
        //     return checkType()
        // },
        noClick: currType === null,
        noKeyboard: currType === null,
        async onDrop(files, fileRejections, event) {
            if (!checkType()) return

            const data = new FormData()
            data.append('image', files[0])

            const result = await $api.post(
                `business/${Number(
                    localStorage.getItem('currOrg'),
                )}/inventory/upload/`,
                {
                    file: files[0],
                    type: currType,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // 'Content-Type':
                        //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                },
            )

            dispatch(inventoryUploadReducer.fetchWithParams())
        },
    })

    return (
        <Modal
            show
            centered
            scrollable
            className='modal-files-wrapper'
            container={document.body}
        >
            <div className='modal-header'>
                <h1
                    className='modal-title fs-5'
                    id='exampleModalCenteredScrollableTitle'
                >
                    Файлы
                </h1>
                <div className='header-actions'>
                    <Select
                        placeholder='выбрерите тип'
                        noOptionsMessage={() => 'name not found'}
                        onChange={e => setCurrType(e.value)}
                        styles={fileSelectStyles}
                        cacheOptions
                        loadOptions={loadOrgs}
                        isLoading={fetchedTypes.isLoading === 'list'}
                        defaultOptions={opts}
                        value={
                            (opts
                                ? opts.find(option => option.value === currType)
                                : '') as any
                        }
                        theme={(defTheme: any) => themeUnset(defTheme)}
                        className='header-select'
                    />
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <div className='content-wrapper'>
                            <input
                                className='input-zone'
                                {...getInputProps()}
                            />
                            <div
                                className='text-center'
                                onClick={() => checkType()}
                            >
                                <p className='dropzone-content'>
                                    Добавить файл
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal-body'>
                {fetchedFiles.isLoading === 'list' ? (
                    <Spinner />
                ) : (
                    <ul>
                        {fetchedFiles.list.map(file => (
                            <li className='file-item' key={file.id}>
                                <span>{file.name}</span>
                                <div className='actions-wrapper'>
                                    {file.pdf && (
                                        <a href={file.pdf}>
                                            pdf{' '}
                                            <SVGDownload
                                                style={{
                                                    height: '20px',
                                                    width: '20px',
                                                }}
                                                stroke='white'
                                            />
                                        </a>
                                    )}
                                    <button
                                        type='button'
                                        onClick={() =>
                                            dispatch(
                                                inventoryUploadReducer.delete(
                                                    file.id,
                                                ),
                                            )}
                                    >
                                        <span>
                                            <SVGDelete
                                                style={{
                                                    height: '20px',
                                                    width: '20px',
                                                }}
                                                fill='white'
                                            />
                                        </span>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='modal-footer'>
                <button
                    type='button'
                    className='search-line'
                    onClick={handleClose}
                >
                    Закрыть
                </button>
            </div>
        </Modal>
    )
}

export default ModalFiles
