'use client';

import SpinnerSvg from '/public/svg/spinner.svg';

import scss from './Spinner.module.scss';

export function SpinnerFit() {
    return <SpinnerSvg className={scss.spinner} />;
}
