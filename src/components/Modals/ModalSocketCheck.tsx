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

interface SelectOptions {
    value: string
    label: string
}

interface SocketCheckModalProps {
    areaId: number
    sessionId: number
    username: string
    type: string
    handleClose: () => void
}

const API_URL = 'wss://py.keyman24.ru/api/v1.1/business/ws/session/'
// const { VITE_WS_URL } = import.meta.env

const ModalSocketCheck: FC<SocketCheckModalProps> = props => {
    const {
        sessionId, areaId, username, type, handleClose,
    } = props
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.account)
    const { currentOrg } = useAppSelector(state => state.org)
    const socket = useRef<WebSocket>()
    const navigate = useNavigate()

    const onSocketSuccess = async () => {
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
                `/${currentOrg.id}/working-area/${areaId}/edit/session/${type}/${sessionId}/element/`,
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
        //     `/${currentOrg.id}/working-area/${areaId}/edit/session/${type}/${sessionId}/element/`,
        // )
    }

    const handleHide = () => {
        if (socket) {
            socket.current?.close()
        }
        handleClose()
    }

    useEffect(() => {
        // const dispatchedThunk = dispatch(fetchByIdOrg(id))

        socket.current = new WebSocket(
            `${API_URL}${sessionId}/?token=${localStorage.getItem(
                'token-access',
            )}`,
        )

        sessionSocket(socket.current, () => onSocketSuccess())

        return () => {
            // dispatchedThunk.abort()
            socket.current?.close()
        }
    }, [sessionId, handleHide])

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
                        // socket.current?.close()
                        handleHide()
                    }}
                >
                    Закрыть
                </button>
            </div>
        </Modal>
    )
}

export default ModalSocketCheck
