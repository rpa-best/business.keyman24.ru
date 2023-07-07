import React from 'react'
import { toast } from 'react-toastify'
import ToastMessage from '../../components/ToastMessage'
import { IWebSocketNotification } from '../../models/webSocketNotification'
import $api from '../../http'
import getErrorMessage from '../getErrorMessage'
import sessionUseHelper from '../sessionUse/sessionUseHelper'
import { type IWorker } from '../../models/worker'

interface SessionUseParams {
    org: number
    area: number
    // worker: number
    session: number
}

interface MessageData {
    type: 'success' | 'error' | 'info'
    data: {
        worker: IWorker
        mode: boolean
        device: number
        user: any
        error?: any
        name?: any
        desc?: any
    }
}

const socketSessionSecurityElement = (
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
    handleWorkerData: (data: { org: number; worker: number }) => void,
) => {
    socket.onopen = () => {
        console.log('WS onopen')
    }
    socket.onmessage = event => {
        // console.log(event.data)
        const message: MessageData = JSON.parse(event.data)
        if (message.type === 'info') {
            toast.warn(
                <ToastMessage
                    name={message.data.name}
                    desc={message.data.desc}
                />,
                {
                    position: 'bottom-right',
                    // toastId: 'customId1',
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
                    // toastId: message.data.worker.id,
                    theme: 'colored',
                },
            )
            callback({
                ...message.data,
                worker: message.data.worker.id,
                ...params,
            })
            handleWorkerData({
                worker: message.data.worker.id,
                org: message.data.worker.org.id,
            })
        }
        if (message.type === 'error') {
            // console.log(message)
            toast.error(
                <ToastMessage
                    name='Ошибка'
                    desc={getErrorMessage(message.data.error) || ''}
                />,
                {
                    position: 'bottom-right',
                    // toastId: message.data.worker.id,
                    theme: 'colored',
                    autoClose: 15000,
                    // draggable: false,
                },
            )
            handleWorkerData({
                worker: message.data.worker.id,
                org: message.data.worker.org?.id,
            })
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

export default socketSessionSecurityElement
