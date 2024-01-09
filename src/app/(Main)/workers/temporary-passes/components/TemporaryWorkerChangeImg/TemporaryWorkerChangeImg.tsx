'use client';

import React, { ChangeEventHandler, useRef } from 'react';
import { useModalStore } from 'store/modalVisibleStore';
import { usePathname, useRouter } from 'next/navigation';
import { updateUserImg } from 'http/workerApi';
import { ImgModal } from 'app/(Main)/workers/[id]/components/ChangeImgModal/ImgModal';
import { toast } from 'react-toastify';
import revalidate from 'utils/revalidate';
import { errorToastOptions } from 'config/toastConfig';

interface TemporaryWorkerChangeImgProps {
    setWorkerImg: (st: File) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TemporaryWorkerChangeImg: React.FC<
    TemporaryWorkerChangeImgProps
> = ({ setWorkerImg, setLoading }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const handleChangeFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        try {
            if (!e.target.files) {
                return;
            }
            if (e.target.files[0].size >= 1048576) {
                toast('Размер файла превышает 1мб', errorToastOptions);
                return;
            }
            setLoading(true);
            setWorkerImg(e.target.files[0]);
            setVisible(false);
        } catch (e: any) {
            toast('Непредвиденная ошибка', errorToastOptions);
        } finally {
            setLoading(false);
        }
    };

    return <ImgModal ref={fileInputRef} handleChangeFile={handleChangeFile} />;
};
