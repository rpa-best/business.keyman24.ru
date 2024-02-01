import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { usePathname } from 'next/navigation';

import { InventoryModalProps } from 'app/(Main)/inventory/types';
import { InventoryFormType } from 'app/(Main)/inventory/components/InventoryModal/types';
import { InventoryFormValidate } from 'app/(Main)/inventory/components/InventoryModal/InventoryModal.utils';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import { IInventoryImage, ReqInventoryBody } from 'http/types';
import {
    createInventoryItem,
    updateInventoryItem,
    uploadInventoryPhoto,
} from 'http/inventoryApi';
import { useModalStore } from 'store/modalVisibleStore';
import DropzoneContentSvg from 'app/(Main)/inventory/svg/dropzoneContent.svg';
import { ImageContainer } from 'app/(Main)/inventory/components/InventoryModal/components';
import { ImageCreateContainer } from 'app/(Main)/inventory/components/InventoryModal/components/ImageCreateContainer';
import { useNotificationStore } from 'store/notificationStore';
import revalidate from 'utils/revalidate';

import scss from './InventoryModal.module.scss';

export const InventoryModal: React.FC<InventoryModalProps> = ({
    type,
    selectedImage,
    setSelectedImage,
    setLoading,
    selectedItem,
    setInventoryData,
}) => {
    const path = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const onSubmit = async (values: InventoryFormType) => {
        setLoading(true);
        const body: ReqInventoryBody = {
            name: values.name,
            desc: values.description,
            type: 'inventory',
            cost: values.cost ?? 0,
        };
        if (type === 'create') {
            await createInventoryItem(body)
                .then((d) => {
                    const location =
                        d.location === null ? '-' : `${d.location.name}`;
                    const newInventory = {
                        ...d,
                        type: d.type.name,
                        location: location,
                    };

                    setInventoryData((inventory) => [
                        ...inventory,
                        newInventory,
                    ]);
                    setVisible(false);
                    revalidate(path);
                    try {
                        selectedImage.forEach(async (i) => {
                            await uploadInventoryPhoto(
                                d.id,
                                // @ts-ignore
                                i.img
                            );
                        });
                    } catch (e) {
                        return e;
                    } finally {
                        setSelectedImage(undefined);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            await updateInventoryItem(selectedItem?.id as number, body)
                .then((d) => {
                    console.log(d);
                    revalidate(path);
                    setVisible(false);
                })
                .finally(() => {
                    setLoading(false);
                });
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
            description: selectedItem?.desc ?? '',
            cost: selectedItem?.cost ?? 0,
        },
        enableReinitialize: true,
        onSubmit,
        validate: InventoryFormValidate,
    });

    const onDrop = async (acceptedFiles: any) => {
        if (type === 'edit') {
            setLoading(true);
            await uploadInventoryPhoto(
                selectedItem?.id as number,
                acceptedFiles[0]
            )
                .then((res) => {
                    const modifiedRes: IInventoryImage = {
                        ...res,
                        image: res.image.slice(22),
                    };
                    setSelectedImage((img) => [...(img as []), modifiedRes]);
                })
                .finally(() => {
                    setLoading(false);
                });

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
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg'],
        },
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
                        {type === 'edit' && (
                            <Input
                                label="Цена"
                                name="cost"
                                value={values.cost.toString()}
                                type="number"
                                onChange={handleChange}
                            />
                        )}
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
        </div>
    );
};
