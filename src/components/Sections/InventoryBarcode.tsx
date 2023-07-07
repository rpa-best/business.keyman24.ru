import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import '../../assets/styles/scss/inventoryBarcode.scss'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import FormInput from '../FormInput'
import ToastMessage from '../ToastMessage'
import sessionUseHelper from '../../helpers/sessionUse/sessionUseHelper'
import isValidWorker from '../../helpers/isValidWorker'

interface InventoryBarcodeProps {
    org: number
    area: number
    session: number
    worker: number
    refetch: () => void
}

const InventoryBarcode: FC<InventoryBarcodeProps> = props => {
    const dispatch = useAppDispatch()
    const { org, area, session, worker, refetch } = props
    const [barcode, setBarcode] = useState<string | null>(null)
    const formik = useFormik({
        initialValues: {
            barcode,
        },
        // validationSchema: InventorySchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true)
            // try {
            //     dispatch(inventoryReducer.put(values))
            // } catch (e) {
            //     console.log(e)
            // }
            return setSubmitting(false)
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
    })

    const handleAdd = () => {
        if (formik.values.barcode?.length !== 12) {
            toast.error(
                <ToastMessage
                    name='Ошибка'
                    desc='Номер должен содержать 12 цифр'
                />,
                {
                    position: 'bottom-right',
                    theme: 'colored',
                    autoClose: 10000,
                },
            )
            return
        }

        isValidWorker({ org, worker }, () =>
            sessionUseHelper({
                org,
                area,
                session,
                worker,
                barcode: formik.values.barcode ?? '',
                refetchElement: refetch,
            }),
        )
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper-inventory'>
                <div className='section-wrapper'>
                    <div className='section-content-inventory'>
                        <form
                            onSubmit={formik.handleSubmit}
                            autoComplete='off'
                            className='d-flex flex-column h-100'
                        >
                            <fieldset
                                disabled={formik.isSubmitting}
                                className='d-flex flex-column h-100 justify-content-between align-items-center'
                            >
                                <h1>Добавьте или отсканируйте штрихкод</h1>

                                <FormInput
                                    name='barcode'
                                    label='Введите номер из 12 цифр'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={nullToEmptyString(
                                        formik.values.barcode,
                                    )}
                                />

                                <div className='input-buttons-wrapper'>
                                    <Button
                                        title='Добавить'
                                        handleClick={() => handleAdd()}
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InventoryBarcode
