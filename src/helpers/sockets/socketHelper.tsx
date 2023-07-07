import React from 'react'
import { toast } from 'react-toastify'
import ToastMessage from '../../components/ToastMessage'
import { IWebSocketNotification } from '../../models/webSocketNotification'

const socketHelper = (socket: WebSocket, callback: () => void) => {
    socket.onopen = () => {
        console.log('WS onopen')
    }
    socket.onmessage = event => {
        const message: IWebSocketNotification = JSON.parse(JSON.parse(event.data))
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
                    toastId: 'customId1',
                    theme: 'colored',
                },
            )
        }
        if (
            message.type === 'success'
            // && message.data.slug === 'organization_upload_successed'
        ) {
            callback()
            toast.success(
                <ToastMessage
                    name={message.data.name}
                    desc={message.data.desc}
                />,
                {
                    position: 'bottom-right',
                    toastId: 'customId2',
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
                    name={message.data.name}
                    desc={message.data.desc}
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

export default socketHelper
