import React from 'react'
import { toast } from 'react-toastify'
import $api from '../../http'
import ToastMessage from '../../components/ToastMessage'
import getErrorMessage from '../getErrorMessage'

const sessionUseNotInventory = async (params: {
    org: number | string
    area: number
    session: number
    worker: number
    user: string
    device: number
    mode: boolean
    refetchElement: () => void
}) => {
    const result = await $api
        .post(
            `business/${params.org}/working_area/${params.area}/session/${params.session}/use/`,
            {
                mode: params.mode,
                worker: params.worker,
                session: params.session,
                user: params.user,
                device: params.device,
            },
        )
        .then(res => {
            // console.log(res)
            if (res.status === 200 || res.status === 201) {
                params.refetchElement()
            }
        })
        .catch(e => {
            toast.error(
                <ToastMessage
                    name='Ошибка session/use'
                    desc={getErrorMessage((e as any).response.data.error) || e.message}
                />,
                {
                    position: 'bottom-right',
                    // toastId: 'customId200',
                    theme: 'colored',
                    autoClose: 10000,
                },
            )
        })
}

export default sessionUseNotInventory
