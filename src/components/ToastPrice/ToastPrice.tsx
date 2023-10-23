import scss from 'app/(Main)/org-settings/bill/components/GetDifferencePrice/GetDifferencePrice.module.scss';

export const ToastPrice = ({ price }: { price: number }) => {
    return (
        <p className={scss.default_text}>
            Цена изменится на <span className={scss.bigger}>{price}</span>
        </p>
    );
};
