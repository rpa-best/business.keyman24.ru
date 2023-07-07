/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
    FC, useEffect, useState, useRef,
} from 'react'
import { useDropzone } from 'react-dropzone'
import Select from 'react-select/async'
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
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
import sessionSocket from '../../helpers/sockets/sessionSocket'
import getErrorMessage from '../../helpers/getErrorMessage'

interface SelectOptions {
    value: string
    label: string
}

interface SocketCheckWorkerModalProps {
    areaId: number
    sessionId: number
    username: string
    type: string
    handleClose: () => void
}

const API_URL = 'wss://py.keyman24.ru/api/v1.1/business/ws/session/'
// const { VITE_WS_URL } = import.meta.env

const ModalSocketCheckWorker: FC<SocketCheckWorkerModalProps> = props => {
    const {
        sessionId, areaId, username, handleClose, type
    } = props
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.account)
    const { currentOrg } = useAppSelector(state => state.org)
    const socket = useRef<WebSocket>()
    const navigate = useNavigate()

    const onSocketSuccess = async (workerId: number, workerOrgId: number) => {
        const result = await $api.patch(
            `business/${currentOrg.id}/working_area/${areaId}/session/${sessionId}/check/`,
            {
                session: sessionId,
                user: username,
            },
        )

        if (result.status === 200) {
            // working-area/2/edit/session/register/15/element/
            navigate(
                `/${currentOrg.id}/working-area/${areaId}/edit/session/${type}/${sessionId}/element/${workerOrgId}/${workerId}/`,
            )
        } else {
            // toast.error(
            //     <ToastMessage
            //         name={message.data.name}
            //         desc={message.data.desc}
            //     />,
            //     {
            //         position: 'bottom-right',
            //         toastId: 'customId2',
            //         theme: 'colored',
            //         autoClose: 15000,
            //     },
            // )
            console.log(result)
        }

        // navigate(
        //     `/${currentOrg.id}/working-area/${areaId}/edit/session/${type}/${sessionId}/element/${workerOrgId}/${workerId}/`,
        // )
    }

    const handleHide = () => {
        if (socket) {
            socket.current?.close()
        }
    }

    useEffect(() => {
        // const dispatchedThunk = dispatch(fetchByIdOrg(id))

        socket.current = new WebSocket(
            `${API_URL}${sessionId}/?token=${localStorage.getItem(
                'token-access',
            )}`,
        )

        socket.current.onopen = () => {
            console.log('WS onopen')
        }
        socket.current.onmessage = event => {
            // console.log(event.data)
            const message = JSON.parse(event.data)
            if (
                message.type === 'info'
                // && message.data.slug === 'organization_upload_started'
            ) {
                toast.warn(
                    <ToastMessage
                        name={message.data.name}
                        desc={message.data.desc}
                    />,
                    {
                        position: 'bottom-right',
                        theme: 'colored',
                    },
                )
            }
            if (
                message.type === 'success'
                // && message.data.slug === 'organization_upload_successed'
            ) {
                onSocketSuccess(message.data.worker.id, message.data.worker.org.id)
                toast.success(
                    <ToastMessage
                        name={`user: ${message.data.user}`}
                        desc={`device: ${message.data.device}`}
                    />,
                    {
                        position: 'bottom-right',
                        theme: 'colored',
                    },
                )
            }
            if (
                message.type === 'error'
                // && message.data.slug === 'organization_upload_failed'
            ) {
                toast.error(
                    <ToastMessage
                        name='Ошибка'
                        desc={getErrorMessage(message.data.error) || ''}
                    />,
                    {
                        position: 'bottom-right',
                        theme: 'colored',
                        autoClose: 15000,
                    },
                )
            }
            console.log('WS onmessage', message)
        }
        socket.current.onclose = () => {
            console.log('WS onclose')
        }
        socket.current.onerror = () => {
            console.log('WS onerror')
        }

        return () => {
            // dispatchedThunk.abort()
            socket.current?.close()
        }
    }, [sessionId])

    return (
        <Modal
            show
            centered
            scrollable
            className='modal-files-wrapper'
            container={document.body}
            onHide={handleHide}
        >
            <div className='modal-header'>
                <h1
                    className='modal-title fs-5'
                    id='exampleModalCenteredScrollableTitle'
                >
                    Приложите карту к устройству
                </h1>
            </div>
            <div className='modal-body'>
                <Spinner />
            </div>
            <div className='modal-footer'>
                <button
                    type='button'
                    className='search-line'
                    onClick={() => {
                        handleClose()
                    }}
                >
                    Закрыть
                </button>
            </div>
        </Modal>
    )
}

export default ModalSocketCheckWorker
