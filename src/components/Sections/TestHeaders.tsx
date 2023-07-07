import React, { FC, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Button from '../Button'
import '../../assets/styles/scss/section.scss'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import FormInput from '../FormInput'
import ToastMessage from '../ToastMessage'

interface InventoryBarcodeProps {}

const TestHeaders: FC<InventoryBarcodeProps> = props => {
    const dispatch = useAppDispatch()
    // const {} = props
    const [barcode, setBarcode] = useState<string | null>(null)
    const [headers, setHeaders] = useState<any[]>([])
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
        // if (formik.values.barcode?.length !== 12) {
        //     toast.error(
        //         <ToastMessage
        //             name='Ошибка'
        //             desc='Номер должен содержать 12 цифр'
        //         />,
        //         {
        //             position: 'bottom-right',
        //             toastId: 'customId200',
        //             theme: 'colored',
        //             autoClose: 10000,
        //         },
        //     )
        //     return
        // }

        fetch(String(formik.values.barcode), {
            method: 'HEAD',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token-access')}`,
            },
        })
            .then(response => {
                // const headers = response.headers
                // response.headers.forEach((value, name) => {
                //     console.log(`${name}: ${value}`)
                // })
                console.warn('HEADERS', [
                    ...Array.from(response.headers.entries()),
                ])
                // console.warn('HEADERS', response.headers.get('Has-Permissions'))
                // console.warn('HEADERS', response.headers.has('has-permissions'))
                // console.warn('HEADERS', response.headers.has('Authorization'))
                setHeaders([...Array.from(response.headers.entries())])
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
        <div className='outlet-wrapper flex-column'>
            <div
                className='default-wrapper'
                style={{ paddingBottom: '0px', paddingRight: '120px' }}
            >
                <div className='section-wrapper'>
                    <div className='section-content'>
                        <form onSubmit={formik.handleSubmit} autoComplete='off'>
                            <fieldset disabled={formik.isSubmitting}>
                                <h1>Test headers</h1>

                                <FormInput
                                    name='barcode'
                                    label='URL'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={nullToEmptyString(
                                        formik.values.barcode,
                                    )}
                                />

                                <div className='input-buttons-wrapper'>
                                    <Button
                                        title='Отправить'
                                        handleClick={() => handleAdd()}
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className='section-content' style={{paddingTop: '0px'}}>
                        {/* {headers.map(header => {
                            return header.map((item: any[], index: any) => {
                                // eslint-disable-next-line react/no-array-index-key
                                return (
                                    <div
                                        className='input-wrapper flex-column'
                                        key={index}
                                    >
                                        <h3
                                            className='h5'
                                            style={{
                                                color: 'var(--text-color-my)',
                                            }}
                                        >
                                            Пароль
                                        </h3>
                                        <input
                                            name='some'
                                            readOnly
                                            className='custom-input'
                                            value={`${item[0]} ${item[1]}`}
                                        />
                                    </div>
                                )
                            })
                        })} */}
                        {headers.map((item, index) => {
                            return (
                                <div
                                    className='input-wrapper flex-column'
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                >
                                    {/* <h3
                                        className='h5'
                                        style={{
                                            color: 'var(--text-color-my)',
                                        }}
                                    >
                                        {`${index}: header`}
                                    </h3> */}
                                    <input
                                        name='some'
                                        readOnly
                                        className='custom-input'
                                        value={`${item[0]}: ${item[1]}`}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestHeaders
