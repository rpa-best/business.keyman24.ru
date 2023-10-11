'use client';

import React, { ChangeEventHandler, useRef } from 'react';
import { useModalStore } from 'store/modalVisibleStore';
import { usePathname, useRouter } from 'next/navigation';
import { updateUserImg } from 'http/workerApi';
import { ImgModal } from 'app/(Main)/workers/[id]/components/ChangeImgModal/ImgModal';
import { toast } from 'react-toastify';
import revalidate from 'utils/revalidate';
import { errorToastOptions } from 'config/toastConfig';

interface ChangeImgModalProps {
    workerId: number;
    setWorkerImg: (st: string) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChangeImgModal: React.FC<ChangeImgModalProps> = ({
    workerId,
    setWorkerImg,
    setLoading,
}) => {
    const path = usePathname();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const handleChangeFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        try {
            setLoading(true);
            updateUserImg(e.target.files as FileList, workerId)
                .then((r) => {
                    setWorkerImg(r.image);
                })
                .finally(() => {
                    setVisible(false);
                    setLoading(false);
                    revalidate(path);
                });
        } catch (e: any) {
            toast('Непредвиденная ошибка', errorToastOptions);
        }
    };

    return <ImgModal ref={fileInputRef} handleChangeFile={handleChangeFile} />;
};
