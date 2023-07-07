/* eslint-disable react/no-unused-prop-types */
import React, { FC } from 'react'

interface IToastMessageProps {
    name: string
    desc: string
}

const ToastMessage: FC<IToastMessageProps> = (props: IToastMessageProps) => {
    const { name, desc } = { ...props }

    return (
        <div style={{ height: '80px' }} className='d-flex flex-column justify-content-center'>
            <h1 style={{ fontSize: '22px', color: '#000' }}>{name}</h1>
            <p style={{ fontSize: '16px', color: '#000' }}>{desc}</p>
        </div>
    )
}

export default ToastMessage
