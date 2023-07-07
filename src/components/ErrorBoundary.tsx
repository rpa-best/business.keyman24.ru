import React, { FC } from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorBoundary: FC = () => {
    const error = useRouteError()
    // console.log('route error', error)

    return (
        <div className='outlet-wrapper'>
            <h1 className='h1' style={{ color: 'var(--text-color-my)' }}>
                something went wrong
            </h1>
        </div>
    )
}

export default ErrorBoundary
