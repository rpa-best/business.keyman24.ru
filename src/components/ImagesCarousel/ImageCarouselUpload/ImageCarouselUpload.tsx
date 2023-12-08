import React from 'react';

import DropzoneContentSvg from 'app/(Main)/inventory/svg/dropzoneContent.svg';
import { useDropzone } from 'react-dropzone';
import { uploadPhoto } from 'http/inventoryApi';
import { IInventoryImage } from 'http/types';
import { ImageCarouselUploadProps } from 'components/ImagesCarousel/types';

import scss from 'components/ImagesCarousel/ImageCarousel.module.scss';
import { createPortal } from 'react-dom';

export const ImageCarouselUpload: React.FC<ImageCarouselUploadProps> = ({
    setImages,
    url,
    setLoading,
}) => {
    const onDrop = async (acceptedFiles: any) => {
        setLoading(true);
        await uploadPhoto(url, acceptedFiles[0])
            .then((res) => {
                const modifiedRes: IInventoryImage = {
                    ...res,
                    image: res.image.slice(22),
                };
                setImages((img) => [...(img as []), modifiedRes]);
            })
            .finally(() => {
                setLoading(false);
            });

        return;
    };

    const { getRootProps, isDragActive, open } = useDropzone({
        maxFiles: 1,
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg'],
        },
        noClick: true,
        onDrop,
    });

    return (
        <>
            {createPortal(
                <div
                    style={{ zIndex: isDragActive ? '9999' : 0 }}
                    {...getRootProps()}
                    className={scss.root_container}
                >
                    {isDragActive && (
                        <div className={scss.carousel_drag_and_drop}>
                            <div className={scss.inventory_dropzone_border}>
                                <div className={scss.inventory_dropzone_active}>
                                    <input />
                                    <div className={scss.dropdown_content}>
                                        <DropzoneContentSvg
                                            className={scss.dropzone_svg_active}
                                        />
                                        <p
                                            className={
                                                scss.dropdown_content_text
                                            }
                                        >
                                            Перетащите файл сюда..
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}
            <div
                onClick={() => open()}
                className={scss.carousel_inventory_dropzone}
            >
                <div className={scss.carousel_dropzone_font}>
                    <DropzoneContentSvg className={scss.dropzone_svg} />
                    <p>Перетащите элемент или нажмите, чтобы выбрать файлы</p>
                </div>
            </div>
        </>
    );
};
