import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

import { InventoryModalProps } from 'app/(Main)/inventory/types';
import { InventoryFormType } from 'app/(Main)/inventory/components/InventoryModal/types';
import { InventoryFormValidate } from 'app/(Main)/inventory/components/InventoryModal/InventoryModal.utils';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { IInventoryImage, ReqInventoryBody } from 'http/types';
import {
    createInventoryItem,
    updateInventoryItem,
    uploadInventoryPhoto,
} from 'http/inventoryApi';
import { Spinner } from 'components/Spinner';
import { useModalStore } from 'store/modalVisibleStore';
import DropzoneContentSvg from 'app/(Main)/inventory/svg/dropzoneContent.svg';
import { ImageContainer } from 'app/(Main)/inventory/components/InventoryModal/components';

import scss from './InventoryModal.module.scss';
import Image from 'next/image';
import { ImageCreateContainer } from 'app/(Main)/inventory/components/InventoryModal/components/ImageCreateContainer';

export const InventoryModal: React.FC<InventoryModalProps> = ({
    type,
    lastId,
    selectedImage,
    setSelectedImage,
    selectedItem,
}) => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onSubmit = async (values: InventoryFormType) => {
        setLoading(true);
        const body: ReqInventoryBody = {
            name: values.name,
            number: values.number,
            desc: values.description,
            type: 'inventory',
        };
        if (type === 'create') {
            await createInventoryItem(body)
                .finally(() => {
                    router.refresh();
                    setLoading(false);
                    setVisible(false);
                })
                .then(() => {
                    selectedImage.forEach(async (i) => {
                        await uploadInventoryPhoto(
                            lastId + 1,
                            // @ts-ignore
                            i.img
                        );
                    });
                });
        } else {
            await updateInventoryItem(selectedItem?.id as number, body).finally(
                () => {
                    router.refresh();
                    setLoading(false);
                    setVisible(false);
                }
            );
        }
    };

    const {
        values,
        isValid,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        touched,
    } = useFormik<InventoryFormType>({
        initialValues: {
            name: selectedItem?.name ?? '',
            number: selectedItem?.number ?? '',
            description: selectedItem?.desc ?? '',
        },
        enableReinitialize: true,
        onSubmit,
        validate: InventoryFormValidate,
    });

    const onDrop = async (acceptedFiles: any) => {
        if (type === 'edit') {
            setLoading(true);
            const res = await uploadInventoryPhoto(
                selectedItem?.id as number,
                acceptedFiles[0]
            ).finally(() => setLoading(false));

            router.refresh();

            const modifiedRes: IInventoryImage = {
                ...res,
                image: res.image.slice(22),
            };

            setSelectedImage((img) => [...(img as []), modifiedRes]);
            return;
        }
        setSelectedImage(
            (img) =>
                [
                    ...(img || []),
                    {
                        img: acceptedFiles[0],
                        preview: URL.createObjectURL(acceptedFiles[0]),
                    },
                ] as IInventoryImage[]
        );
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        multiple: false,
        onDrop,
    });

    return (
        <div className={scss.inventory_wrapper}>
            {isDragActive ? (
                <div
                    {...getRootProps()}
                    className={scss.inventory_dropzone_border}
                >
                    <div className={scss.inventory_dropzone_active}>
                        <input {...getInputProps()} />
                        <div className={scss.dropdown_content}>
                            <DropzoneContentSvg
                                className={scss.dropzone_svg_active}
                            />
                            <p className={scss.dropdown_content_text}>
                                Перетащите файл сюда..
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <h2 className={scss.inventory_title}>
                        Инвентарь /{' '}
                        <span>
                            {type === 'create'
                                ? 'добавление'
                                : 'редактирование'}
                        </span>
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className={scss.inventory_content}
                    >
                        <Input
                            onBlur={handleBlur}
                            handleError={touched.name && errors.name}
                            label={'Название'}
                            placeholder={'Укажите наименование'}
                            value={values.name}
                            name="name"
                            onChange={handleChange}
                        />
                        <Input
                            label={'Описание'}
                            handleError={
                                touched.description && errors.description
                            }
                            placeholder={'Укажите описание'}
                            value={values.description}
                            name="description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Input
                            type="number"
                            label={'Номер'}
                            onBlur={handleBlur}
                            handleError={touched.number && errors.number}
                            placeholder={'Укажите номер'}
                            value={values.number}
                            name="number"
                            onChange={handleChange}
                        />
                        {type === 'edit' ? (
                            <ImageContainer
                                setSelectedImage={setSelectedImage as any}
                                setLoading={setLoading}
                                rootProps={getRootProps}
                                selectedItemId={selectedItem?.id as number}
                                selectedImage={selectedImage as any}
                            />
                        ) : (
                            <ImageCreateContainer
                                selectedImage={selectedImage as []}
                                rootProps={getRootProps}
                                setSelectedImage={setSelectedImage as any}
                            />
                        )}
                        <div className={scss.button_wrapper}>
                            <Button
                                disabled={!isValid}
                                onClick={() => {}}
                                type="submit"
                            >
                                {type === 'create' ? 'Добавить' : 'Сохранить'}
                            </Button>
                        </div>
                    </form>
                </>
            )}

            {loading && <Spinner />}
        </div>
    );
};
