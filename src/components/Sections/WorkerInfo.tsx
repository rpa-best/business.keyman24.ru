import React, { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Spinner from '../Spinner/Spinner'
import '../../assets/styles/scss/workerInfo.scss'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import {
    useFetchByIdWorkerDocsNestedElementQuery,
    useFetchByIdWorkerNestedElementQuery,
} from '../../store/api/workerNestedElementApi'
import Avatar from '../../assets/img/topnav/avatar.svg'
import PhotoPreload from '../PhotoPreload'
import getEntity from '../../helpers/fixMe'
import convertDate from '../../helpers/convertDate'
import FormInput from '../FormInput'
import isDateExpired from '../../helpers/isDateExpired'
import { useDropzone } from 'react-dropzone'
import $api from '../../http'
import { workerReducer } from '../../store'

interface WorkerInfoProps {
    org: number
    worker: number
    // refetch: () => void
}

const WorkerInfo: FC<WorkerInfoProps> = props => {
    const dispatch = useAppDispatch()
    const { org, worker } = props
    const {
        data,
        isLoading: workerLoading,
        isFetching: workerFetching,
    } = useFetchByIdWorkerNestedElementQuery({
        orgId: org,
        workerId: worker,
    })

    const {
        data: serverRes,
        isLoading: docsLoading,
        isFetching: docsFetching,
        refetch
    } = useFetchByIdWorkerDocsNestedElementQuery({
        orgId: org,
        workerId: worker,
    })

    const isLoading =
        workerLoading || workerFetching || docsLoading || docsFetching

    const docs = serverRes?.results || []

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        multiple: false,
        async onDrop(files, fileRejections, event) {
            const dataTemp = new FormData()
            dataTemp.append('image', files[0])

            // dispatch(
            //     imageNestedInventoryReducer.createNested(
            //         {
            //             image: data,
            //         },
            //         {
            //             id,
            //             endpoint: 'image',
            //         },
            //     ),
            // )

            const result = await $api.patch(
                `business/${Number(
                    localStorage.getItem('currOrg'),
                )}/worker/${worker}/`,
                dataTemp,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            refetch()
        },
    })

    useEffect(() => {}, [data?.image])

    if (isLoading) {
        return <Spinner />
    }

    // console.log(serverRes)

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper-worker'>
                <div className='section-wrapper-worker'>
                    <div className='section-content-worker'>
                        <form autoComplete='off'>
                            <fieldset disabled>
                                <h1>Информация о работнике</h1>

                                <div className='d-flex justify-content-between h-100 align-items-center'>
                                    <div className='form-image-worker'>
                                        <div className='img-wrapper'>
                                            <div
                                                {...getRootProps({
                                                    className: 'dropzone',
                                                })}
                                            >
                                                <div className='content-wrapper'>
                                                    <input
                                                        className='input-zone'
                                                        {...getInputProps()}
                                                    />
                                                    {/* <img alt='worker_photo' src={formData.data.image ?? Avatar} /> */}
                                                    <PhotoPreload
                                                        image={
                                                            data?.image ??
                                                            Avatar
                                                        }
                                                        preload={Avatar}
                                                        alt='worker_photo'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column w-100 h-100'>
                                        <div className='input-wrapper'>
                                            <h3 className='input-label'>ФИО</h3>
                                            <input
                                                readOnly
                                                name='name'
                                                className='custom-input'
                                                value={nullToEmptyString(
                                                    data?.name,
                                                )}
                                            />
                                        </div>

                                        <div
                                            className='input-wrapper'
                                            style={{
                                                alignItems: 'baseline',
                                                marginTop: '0px',
                                            }}
                                        >
                                            <h3 className='input-label'>
                                                Username
                                            </h3>
                                            <input
                                                readOnly
                                                name='username'
                                                className='custom-input'
                                                value={nullToEmptyString(
                                                    data?.user?.username,
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex row row-cols-1 justify-content-between'>
                                    {/* <div className='input-row-wrapper flex-column'>
                                    <h3 className='input-label'>user_lc_id</h3>
                                    <input
                                        readOnly
                                        name='user_lc_id'
                                        className='custom-input'
                                        value={data?.user_lc_id || ''}
                                    />
                                </div> */}

                                    <div className='input-row-wrapper flex-column'>
                                        <h3 className='input-label'>
                                            Организация
                                        </h3>
                                        <input
                                            readOnly
                                            name='org.name'
                                            className='custom-input'
                                            value={data?.org.name || ''}
                                        />
                                    </div>
                                    {/* <div className='input-row-wrapper flex-column'>
                                    <h3 className='input-label'>lc_id</h3>
                                    <input
                                        readOnly
                                        name='lc_id'
                                        className='custom-input'
                                        value={data?.lc_id || ''}
                                    />
                                </div> */}
                                </div>
                                <div
                                    className={`d-flex row row-cols-${docs.length} justify-content-between`}
                                    style={{ marginTop: '28px' }}
                                >
                                    {docs.map((doc, index) => {
                                        return (
                                            <div
                                                className='input-row-wrapper flex-column'
                                                key={doc.id}
                                            >
                                                {/* <h3 className='input-label'>
                                                    {doc.name}
                                                </h3>
                                                <input
                                                    readOnly
                                                    name={doc.name}
                                                    className='custom-input'
                                                    value={`${convertDate(
                                                        doc.active_to,
                                                    )}`}
                                                /> */}
                                                <FormInput
                                                    name={doc.name}
                                                    label={doc.name}
                                                    value={`${convertDate(
                                                        doc.active_to,
                                                    )}`}
                                                    classNameWrapper={['mb-0']}
                                                    error={
                                                        isDateExpired(
                                                            doc.active_to,
                                                        )
                                                            ? 'Просрочен'
                                                            : undefined
                                                    }
                                                    readonly
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                                {/* <div
                                    className='input-wrapper'
                                    style={{
                                        alignItems: 'baseline',
                                        marginTop: '0px',
                                    }}
                                >
                                    <h3 className='input-label'>Username</h3>
                                    <input
                                        readOnly
                                        name='username'
                                        className='custom-input'
                                        value={nullToEmptyString(
                                            data?.user?.username,
                                        )}
                                    />
                                </div> */}
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkerInfo
