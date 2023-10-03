'use client';

import { ChangeEventHandler, useRef } from 'react';
import { useModalStore } from 'store/modalVisibleStore';
import { useRouter } from 'next/navigation';
import { updateUserImg } from 'http/workerApi';
import { ImgModal } from 'app/(Main)/workers/[id]/components/ChangeImgModal/ImgModal';
import { toast } from 'react-toastify';

export const ChangeImgModal = ({ workerId }: { workerId: number }) => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const handleChangeFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        try {
            updateUserImg(e.target.files as FileList, workerId).then((r) => {
                router.refresh();
            });
            setVisible(false);
        } catch (e: any) {
            toast('Непредвиденная ошибка', {
                position: 'bottom-right',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'error',
                theme: 'colored',
            });
        }
    };

    return <ImgModal ref={fileInputRef} handleChangeFile={handleChangeFile} />;
};
