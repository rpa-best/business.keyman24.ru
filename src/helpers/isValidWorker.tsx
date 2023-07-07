import { toast } from 'react-toastify'
import React from 'react'
import ToastMessage from '../components/ToastMessage'

interface ValidWorkerParams {
    worker: number
    org: number
}

const isValidWorker = (params: ValidWorkerParams, callback: () => void): void => {
    if (params.worker !== 0 && params.org !== 0) {
        callback()
    } else {
        toast.error(
            <ToastMessage
                name='Ошибка'
                desc='Приложите карту'
            />,
            {
                position: 'bottom-right',
                theme: 'colored',
                autoClose: 10000,
            },
        )
    }
}

export default isValidWorker
