import React from 'react'
import { ReactComponent as SVGSpinner } from '../../assets/img/shared/spinner.svg'

export default function Spinner() {
    return (
        <div className='d-flex justify-content-center align-items-center h-100'>
            <SVGSpinner className='spinner' />
        </div>
    )
}
