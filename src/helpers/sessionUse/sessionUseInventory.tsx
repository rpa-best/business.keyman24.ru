import React from 'react'
import { toast } from 'react-toastify'
import $api from '../../http'
import ToastMessage from '../../components/ToastMessage'
import getErrorMessage from '../getErrorMessage'

const sessionUseInventory = async (params: {
    org: number
    area: number
    session: number
    worker?: number
    barcode: any
    refetchElement: () => void
}) => {
    const result = await $api
        .post(
            `business/${params.org}/working_area/${params.area}/session/${params.session}/use/`,
            {
                worker: params.worker,
                session: params.session,
                barcode: params.barcode,
            },
        )
        .then(res => {
            if (res.status === 201) {
                params.refetchElement()
            }
        })
        .catch(e =>
            toast.error(
                <ToastMessage
                    name='Ошибка'
                    desc={getErrorMessage((e as any).response.data.error) || e.message}
                />,
                {
                    position: 'bottom-right',
                    toastId: 'customId200',
                    theme: 'colored',
                    autoClose: 10000,
                },
            ),
        )
}

export default sessionUseInventory
