import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';

import { deleteInventoryItemPhoto } from 'http/inventoryApi';
import { ImageContainerProps } from 'app/(Main)/inventory/types';
import DropzoneContentSvg from 'app/(Main)/inventory/svg/dropzoneContent.svg';
import DeleteSvg from '/public/svg/x.svg';
import revalidate from 'utils/revalidate';

import scss from 'app/(Main)/inventory/components/InventoryModal/InventoryModal.module.scss';

export const ImageContainer: React.FC<ImageContainerProps> = ({
    selectedImage,
    rootProps,
    selectedItemId,
    setLoading,
    setSelectedImage,
}) => {
    const handleDeleteImageClick = async (id: number) => {
        setLoading(true);
        await deleteInventoryItemPhoto(selectedItemId, id)
            .then(() => {
                setSelectedImage(
                    (img) => img?.filter((image) => image.id !== id)
                );
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            {selectedImage && selectedImage.length !== 0 ? (
                <>
                    <div className={scss.images_wrapper}>
                        <div
                            {...rootProps()}
                            className={scss.add_image_wrapper}
                        >
                            <DropzoneContentSvg className={scss.dropzone_svg} />
                        </div>
                        {selectedImage.map((item, index) => {
                            return (
                                <div className={scss.image_wrapper} key={index}>
                                    <Image
                                        className={scss.image}
                                        src={`https://py.keyman24.ru${item.image}`}
                                        fill
                                        alt="изображение инвентаря"
                                    />
                                    <div
                                        onClick={() =>
                                            handleDeleteImageClick(item.id)
                                        }
                                        className={scss.delete_svg_wrapper}
                                    >
                                        <DeleteSvg
                                            className={scss.delete_svg}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div {...rootProps()} className={scss.inventory_dropzone}>
                    <div className={scss.dropzone_font}>
                        <DropzoneContentSvg className={scss.dropzone_svg} />
                        <p>
                            Перетащите элемент или нажмите, чтобы выбрать файлы
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
