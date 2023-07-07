import React, { FC } from 'react'
import { ReactComponent as SVGSpinner } from '../../assets/img/shared/spinner.svg'

const SpinnerSidebar: FC = () => {
    return (
        <li>
            <a href='/'>
                <span className='marker-link' />
                <span className='icon'>
                    <SVGSpinner
                        style={{ maxHeight: '30px', maxWidth: '30px' }}
                        className='spinner'
                    />
                </span>
                <span className='link_name text-color-inactive'>
                    Loading...
                </span>
            </a>
        </li>
    )
}

export default SpinnerSidebar
