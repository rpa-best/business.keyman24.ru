import React from 'react';
import revalidate from 'utils/revalidate';
import { usePathname } from 'next/navigation';

import {
    AddWorkerDocumentFormProps,
    AddWorkerFormTypes,
} from 'app/(Main)/workers/[id]/components/WorkerDocsTable/AddWorkerDocumentForm/types';

import { createWorkerDocument } from 'http/workerApi';
import { CreateWorkerDocumentBody } from 'http/types';
import { formatDate } from 'utils/formatDate';
import { useFormik } from 'formik';
import { AddWorkerDocumentFormValidate } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/AddWorkerDocumentForm/AddWorkerDocumentForm.utils';
import { Input } from 'components/UI/Inputs/Input';
import { InputDate } from 'components/UI/Inputs/InputDate';
import { Button } from 'components/UI/Buttons/Button';

import scss from './AddWorkerDocumentForm.module.scss';

export const AddWorkerDocumentForm: React.FC<AddWorkerDocumentFormProps> = ({
    id,
    setTableData,
    setVisible,
}) => {
    const path = usePathname();
    const onSubmit = async (values: AddWorkerFormTypes) => {
        const body: CreateWorkerDocumentBody = {
            name: values.name,
            active_from: formatDate(values.dateTo as Date),
            active_to: formatDate(new Date()),
        };
        const newDoc = await createWorkerDocument(+id, body);
        const activeTo = new Date(newDoc.activeTo);

        const activeFrom = new Date(newDoc.activeFrom);

        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        const formattedActiveTo = activeTo.toLocaleDateString(
            'ru-RU',
            options as any
        );

        const formattedActiveFrom = activeFrom.toLocaleDateString(
            'ru-RU',
            options as any
        );

        const formattedNewDoc = {
            ...newDoc,
            formattedActiveTo,
            formattedActiveFrom,
        };

        setTableData((prev) => [...prev, formattedNewDoc]);
        setVisible(false);
        revalidate(path);
    };

    const {
        handleBlur,
        setFieldValue,
        touched,
        handleSubmit,
        isValid,
        setFieldTouched,
        handleChange,
        values,
        errors,
    } = useFormik<AddWorkerFormTypes>({
        initialValues: {
            dateTo: null,
            name: '',
        },
        onSubmit,
        validate: AddWorkerDocumentFormValidate,
    });

    return (
        <form className={scss.add_document_form} onSubmit={handleSubmit}>
            <h3>Добавление документа</h3>
            <Input
                value={values.name}
                label="Укажите название документа"
                handleError={touched.name && errors.name}
                placeholder="Название документа"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
            />
            <InputDate
                value={values.dateTo}
                onChange={(Data: Date) => setFieldValue('dateTo', Data)}
                label="Укажите срок действия"
                alwaysShowMask={true}
                mask="99.99.9999"
                onBlur={() => setFieldTouched('dateTo', true)}
                minDate={new Date()}
                handleError={touched.dateTo && (errors.dateTo as any)}
                name="dateTo"
            />
            <Button disabled={!isValid} onClick={() => {}} type="submit">
                Добавить
            </Button>
        </form>
    );
};
