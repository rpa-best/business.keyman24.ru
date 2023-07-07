/* eslint-disable react/require-default-props */
import React, { FC } from 'react'
import { ReactComponent as SVGSpinner } from '../../assets/img/shared/spinner.svg'

interface InlineSpinnerProps {
    textColor?: string
}

const InlineSpinner: FC<InlineSpinnerProps> = (
    props = { textColor: 'var( --text-color-my)' },
) => {
    const { textColor } = props
    return (
        <div className='d-flex justify-content-center align-items-center h-100'>
            <SVGSpinner
                style={{ maxHeight: '30px', maxWidth: '30px' }}
                className='spinner'
            />
            <span
                style={{
                    fontSize: '20px',
                    marginLeft: '10px',
                    color: textColor,
                }}
            >
                Loading...
            </span>
        </div>
    )
}

export default InlineSpinner
