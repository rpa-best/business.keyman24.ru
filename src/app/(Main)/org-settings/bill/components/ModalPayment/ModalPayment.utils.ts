import { PaymentType } from 'app/(Main)/org-settings/bill/components/ModalPayment/types';

export const ModalPaymentValidate = (values: PaymentType) => {
    const errors: { count?: string } = {};

    if (!values.count) {
        errors.count = 'Обязательное поле';
    } else if (+values.count < 1000) {
        errors.count = 'Сумма не может быть меньше 1000';
    }

    return errors;
};
