import { SpinnerFit } from 'components/Spinner/SpinnerFit';

import scss from './AttachCard.module.scss';

export const AttachCard = () => {
    return (
        <div>
            <h2 className={scss.spinner_header}>
                Приложите карту к устройству
            </h2>
            <div className={scss.spinner_layout}>
                <SpinnerFit />
            </div>
        </div>
    );
};
