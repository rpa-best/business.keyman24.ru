import { ChangeEventHandler, forwardRef, MutableRefObject } from 'react';
import { Button } from 'components/UI/Buttons/Button';

import scss from 'app/(Main)/workers/[id]/components/WorkerEditForm/WorkerEditForm.module.scss';

interface ImgModalProps {
    handleChangeFile: ChangeEventHandler<HTMLInputElement>;
}

export const ImgModal = forwardRef<HTMLInputElement, ImgModalProps>(
    function ImgModal(props, ref) {
        const onLoadClick = () => {
            (ref as MutableRefObject<HTMLInputElement>).current.click();
        };

        return (
            <div
                onClick={(e) => e.stopPropagation()}
                className={scss.change_img_container}
            >
                <div className={scss.change_img}>
                    <div className={scss.change_img_content}>
                        <h2 className={scss.change_img_title}>
                            Загрузка новой фотографии
                        </h2>
                        <p className={scss.change_img_text}>
                            Вы можете загрузить изображение в формате JPEG или
                            PNG. Максимальный размер файла: 1 мб.
                        </p>
                        <div className={scss.button_wrapper}>
                            <input
                                onChange={props.handleChangeFile}
                                ref={ref}
                                accept="image/jpeg, image/png"
                                className={scss.input_img}
                                type="file"
                                alt="Отправить"
                            />
                            <Button type="button" onClick={onLoadClick}>
                                Загрузить изображение
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
