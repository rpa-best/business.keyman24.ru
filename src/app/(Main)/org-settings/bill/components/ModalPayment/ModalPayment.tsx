'use client';

import { useFormik } from 'formik';

import FileSaver from 'file-saver';
import { Input } from 'components/UI/Inputs/Input';
import { PaymentType } from 'app/(Main)/org-settings/bill/components/ModalPayment/types';
import { ModalPaymentValidate } from 'app/(Main)/org-settings/bill/components/ModalPayment/ModalPayment.utils';
import { Button } from 'components/UI/Buttons/Button';
import { topUpBalance } from 'http/organizationApi';
import { useModalStore } from 'store/modalVisibleStore';

import scss from './ModalPayment.module.scss';

export const ModalPayment = () => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    function onSubmit(values: PaymentType) {
        topUpBalance(values.count).then((d) => {
            FileSaver.saveAs(d.word);
            setVisible(false);
        });
    }

    const { handleBlur, touched, handleSubmit, handleChange, values, errors } =
        useFormik<PaymentType>({
            initialValues: {
                count: 1000,
            },
            onSubmit,
            validate: ModalPaymentValidate,
        });

    return (
        <form className={scss.form} onSubmit={handleSubmit}>
            <h2 className={scss.title}>Пополнение баланса</h2>
            <Input
                placeholder="Сумма пополнения"
                type="number"
                label="Укажите сумму для пополнения"
                value={values.count.toString()}
                name="count"
                onBlur={handleBlur}
                handleError={touched.count && errors.count}
                onChange={handleChange}
            />
            <div className={scss.form_button}>
                <Button onClick={() => {}} type="submit">
                    Пополнить
                </Button>
            </div>
        </form>
    );
};
