import { useFormik } from 'formik';
import { EnterCodeFormValues } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';
import { CodeFormValidate } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/EnterCodeForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { Input } from 'components/UI/Inputs/Input';

import scss from './EnterCodeFOrm.module.scss';

export const EnterCodeForm = () => {
    const onSubmit = (values: EnterCodeFormValues) => {};

    const {
        values,
        handleSubmit,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
    } = useFormik<EnterCodeFormValues>({
        initialValues: { code: '' },
        onSubmit,
        validate: CodeFormValidate,
    });

    return (
        <form className={scss.form} onSubmit={handleSubmit}>
            <h2 className={scss.form_title}>
                Добавьте или отсканируйте штрихкод
            </h2>
            <div className={scss.input_wrapper}>
                <Input
                    onBlur={handleBlur}
                    placeholder="Укажите код"
                    label="Введите код из 12 цифр"
                    type="number"
                    value={values.code}
                    name="code"
                    onChange={handleChange}
                    autoComplete="off"
                    handleError={touched.code && errors.code}
                />
            </div>
            <div className={scss.button_wrapper}>
                <Button
                    disabled={touched.code && !isValid}
                    onClick={() => {}}
                    type="submit"
                >
                    Добавить
                </Button>
            </div>
        </form>
    );
};
