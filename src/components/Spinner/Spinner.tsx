'use client';
import { createPortal } from 'react-dom';

import SpinnerSvg from '/public/svg/spinner.svg';

import scss from './Spinner.module.scss';

export function Spinner() {
    return createPortal(
        <div className={scss.spinner_wrapper}>
            <SpinnerSvg className={scss.spinner} />
        </div>,
        document.body
    );
}
