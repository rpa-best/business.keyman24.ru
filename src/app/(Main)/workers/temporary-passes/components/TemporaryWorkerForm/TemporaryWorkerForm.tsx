'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useFormik } from 'formik';

import EditSvg from '/public/svg/edit.svg';
import AvatarSvg from '/public/svg/avatar.svg';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import { usePathname } from 'next/navigation';

import { Spinner } from 'components/Spinner';
import { Modal } from 'components/Modal';
import { TemporaryWorkerFormValidate } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerForm/TemporaryWorkerForm.utils';
import { TemporaryWorkerChangeImg } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerChangeImg';

import { useModalStore } from 'store/modalVisibleStore';

import { TemporaryWorkerFormValuesType } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerForm/types';
import { createTemporaryWorker } from 'http/workerApi';
import revalidate from 'utils/revalidate';
import { IWorker } from 'http/types';

import scss from './TemporaryWorkerForm.module.scss';

interface TemporaryWorkerWithEnd extends IWorker {
    desc: string;
}

export const TemporaryWorkerForm: React.FC<{
    tempWorkers: TemporaryWorkerWithEnd[];
}> = ({ tempWorkers }) => {
    const [workerImg, setWorkerImg] = useState<string | null>(null);

    const pathname = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: TemporaryWorkerFormValuesType) => {
        setLoading(true);
        createTemporaryWorker({
            name: values.fullName,
            desc: values.description,
            image: values.photo,
        })
            .then((w) => {
                tempWorkers.push({
                    ...w,
                    desc: w.desc,
                } as TemporaryWorkerWithEnd);
                revalidate(pathname);
                resetForm();
                setWorkerImg(null);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const {
        resetForm,
        touched,
        isValid,
        values,
        errors,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
        handleChange,
    } = useFormik<TemporaryWorkerFormValuesType>({
        initialValues: {
            fullName: '',
            description: '',
            photo: null,
        },
        enableReinitialize: true,
        onSubmit,
        validate: TemporaryWorkerFormValidate,
    });

    useEffect(() => {
        if (values.photo) {
            const reader = new FileReader();
            reader.readAsDataURL(values.photo);
            reader.onload = () => {
                setWorkerImg(reader.result as string);
            };
        }
    }, [values.photo]);

    return (
        <form
            style={{ marginBottom: '20px' }}
            onSubmit={handleSubmit}
            className={scss.worker_card_layout}
        >
            <h2 className={scss.worker_card_title}>Информация о госте</h2>
            <div className={scss.worker_content}>
                <div className={scss.worker_card_image_wrapper}>
                    {workerImg ? (
                        <Image
                            style={{ borderRadius: '50%' }}
                            src={workerImg}
                            alt="Изображение работника"
                            fill
                        />
                    ) : (
                        <AvatarSvg
                            style={{
                                width: '100%',
                                height: '100%',
                                color: '#414141',
                            }}
                        />
                    )}
                    <button
                        onClick={() => {
                            setVisible(true);
                        }}
                        type="button"
                        className={scss.change_img_wrapper}
                    >
                        <EditSvg />
                    </button>
                </div>
                <div className={scss.worker_card_data}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            autoComplete="off"
                            onBlur={handleBlur}
                            label="ФИО"
                            placeholder="Введите ФИО"
                            value={values.fullName}
                            handleError={touched.fullName && errors.fullName}
                            name="fullName"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            autoComplete="off"
                            onBlur={handleBlur}
                            label="Описание"
                            placeholder="Введите описание"
                            value={values.description}
                            handleError={
                                touched.description && errors.description
                            }
                            name="description"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={scss.worker_card_button_wrapper}>
                        <Button
                            disabled={!isValid}
                            onClick={() => {}}
                            type="submit"
                        >
                            Создать гостя
                        </Button>
                    </div>
                </div>
            </div>
            <Modal>
                <TemporaryWorkerChangeImg
                    setLoading={setLoading}
                    setWorkerImg={(photo: File) =>
                        setFieldValue('photo', photo)
                    }
                />
            </Modal>
            {loading && <Spinner />}
        </form>
    );
};
