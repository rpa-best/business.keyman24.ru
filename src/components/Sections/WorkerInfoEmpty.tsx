import React, { FC } from 'react'
import '../../assets/styles/scss/workerInfo.scss'
import Avatar from '../../assets/img/topnav/avatar.svg'
import PhotoPreload from '../PhotoPreload'

interface WorkerInfoProps {}

const WorkerInfoEmpty: FC<WorkerInfoProps> = props => {
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
                                            <div className='dropzone'>
                                                <div className='content-wrapper'>
                                                    <PhotoPreload
                                                        image={Avatar}
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
                                                value=''
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
                                                value=''
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex row row-cols-1 justify-content-between'>
                                    {/* <div className='input-row-wrapper flex-column'>
                                        <h3 className='input-label'>
                                            user_lc_id
                                        </h3>
                                        <input
                                            readOnly
                                            name='user_lc_id'
                                            className='custom-input'
                                            value=''
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
                                            value=''
                                        />
                                    </div>
                                    {/* <div className='input-row-wrapper flex-column'>
                                        <h3 className='input-label'>lc_id</h3>
                                        <input
                                            readOnly
                                            name='lc_id'
                                            className='custom-input'
                                            value=''
                                        />
                                    </div> */}
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkerInfoEmpty
