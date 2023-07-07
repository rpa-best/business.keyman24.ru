import React from 'react'
import { toast } from 'react-toastify'
import $api from '../../http'
import ToastMessage from '../../components/ToastMessage'
import getErrorMessage from '../getErrorMessage'

interface SessionUseParams {
    org: number
    area: number
    session: number
    worker: number
    user: string
    device: number
    mode: boolean
    barcode: string | String
    refetchElement: () => void
}

// {
//     org: number
//     area: number
//     session: number
//     worker: number
//     barcode: any
//     refetchElement: () => void
// }

type SessionUseParamsWithBarcode = Omit<
    SessionUseParams,
    'user' | 'device' | 'mode'
>
type SessionUseParamsWithoutBarcode = Omit<SessionUseParams, 'barcode'>

const isSessionUseParamsWithBarcode = (
    obj: any,
): obj is SessionUseParamsWithBarcode => {
    return 'barcode' in obj
}

const sessionUseHelper = async (
    params: SessionUseParamsWithBarcode | SessionUseParamsWithoutBarcode,
) => {
    const body = isSessionUseParamsWithBarcode(params)
        ? {
            worker: params.worker,
            session: params.session,
            barcode: params.barcode,
        }
        : {
            mode: params.mode,
            worker: params.worker,
            session: params.session,
            user: params.user,
            device: params.device,
        }

    const result = await $api
        .post(
            `business/${params.org}/working_area/${params.area}/session/${params.session}/use/`,
            body,
        )
        .then(res => {
            if (res.status === 201) {
                params.refetchElement()
            }
        })
        .catch(e => {
            toast.error(
                <ToastMessage
                    name={`Ошибка session/use ${e.response.status}`}
                    desc={
                        getErrorMessage((e as any).response.data.error) || e.message
                    }
                />,
                {
                    position: 'bottom-right',
                    theme: 'colored',
                    autoClose: 10000,
                },
            )
        })
}

export default sessionUseHelper
