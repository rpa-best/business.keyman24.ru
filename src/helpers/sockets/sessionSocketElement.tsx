import React from 'react'
import { toast } from 'react-toastify'
import ToastMessage from '../../components/ToastMessage'
import { IWebSocketNotification } from '../../models/webSocketNotification'
import $api from '../../http'
import getErrorMessage from '../getErrorMessage'
import sessionUseHelper from '../sessionUse/sessionUseHelper'

interface SessionUseParams {
    org: number
    area: number
    worker: number
    session: number
}

const sessionSocketElement = (
    socket: WebSocket,
    params: SessionUseParams,
    callback: (data: {
        org: number
        area: number
        worker: number
        session: number
        mode: boolean
        user: string
        device: number
    }) => void,
) => {
    socket.onopen = () => {
        console.log('WS onopen')
    }
    socket.onmessage = event => {
        // console.log(event.data)
        const message = JSON.parse(event.data)
        if (message.type === 'info') {
            toast.warn(
                <ToastMessage
                    name={message.data.name}
                    desc={message.data.desc}
                />,
                {
                    position: 'bottom-right',
                    toastId: 'customId1',
                    theme: 'colored',
                },
            )
        }
        if (message.type === 'success') {
            toast.success(
                <ToastMessage
                    name={`user: ${message.data.user}`}
                    desc={`device: ${message.data.device}`}
                />,
                {
                    position: 'bottom-right',
                    toastId: 'customId2',
                    theme: 'colored',
                },
            )
            callback({
                ...message.data,
                ...params,
            })
        }
        if (message.type === 'error') {
            // console.log(message.data)
            toast.error(
                <ToastMessage
                    name='Ошибка'
                    desc={getErrorMessage(message.data.error) || ''}
                />,
                {
                    position: 'bottom-right',
                    toastId: 'customId2',
                    theme: 'colored',
                    autoClose: 15000,
                },
            )
        }
        console.log('WS onmessage', message)
    }
    socket.onclose = () => {
        console.log('WS onclose')
    }
    socket.onerror = () => {
        console.log('WS onerror')
    }
}

export default sessionSocketElement
