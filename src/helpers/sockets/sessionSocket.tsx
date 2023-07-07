import React from 'react'
import { toast } from 'react-toastify'
import ToastMessage from '../../components/ToastMessage'
import { IWebSocketNotification } from '../../models/webSocketNotification'

const sessionSocket = (socket: WebSocket, callback: () => void) => {
    socket.onopen = () => {
        console.log('WS onopen')
    }
    socket.onmessage = event => {
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
            callback()
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
                    name={message.data.name}
                    desc={message.data.desc}
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
    socket.onclose = () => {
        console.log('WS onclose')
    }
    socket.onerror = () => {
        console.log('WS onerror')
    }
}

export default sessionSocket
