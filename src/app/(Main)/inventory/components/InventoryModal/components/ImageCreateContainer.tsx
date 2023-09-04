import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

import { deleteInventoryItemPhoto } from 'http/inventoryApi';
import { ImageContainerCreateProps } from 'app/(Main)/inventory/types';
import DropzoneContentSvg from 'app/(Main)/inventory/svg/dropzoneContent.svg';
import DeleteSvg from '/public/svg/x.svg';

import scss from 'app/(Main)/inventory/components/InventoryModal/InventoryModal.module.scss';

export const ImageCreateContainer: React.FC<ImageContainerCreateProps> = ({
    selectedImage,
    rootProps,
    setSelectedImage,
}) => {
    const handleDeleteImageClick = async (url: string) => {
        setSelectedImage((img) => img?.filter((image) => image !== url));
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
                        {selectedImage?.map((item, index) => {
                            return (
                                <div className={scss.image_wrapper} key={index}>
                                    <Image
                                        className={scss.image}
                                        src={item}
                                        fill
                                        alt="изображение инвентаря"
                                    />
                                    <div
                                        onClick={() =>
                                            handleDeleteImageClick(
                                                item as string
                                            )
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
