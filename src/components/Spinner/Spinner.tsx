import SpinnerSvg from '/public/svg/spinner.svg';

import { motion } from 'framer-motion';

import scss from './Spinner.module.scss';

export function Spinner() {
    return (
        <div className={scss.spinner_wrapper}>
            <SpinnerSvg className={scss.spinner} />
        </div>
    );
}
