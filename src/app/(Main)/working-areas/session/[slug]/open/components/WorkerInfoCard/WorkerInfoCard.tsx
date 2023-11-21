import React from 'react';
import Image from 'next/image';

import AvatarSvg from '/public/svg/avatar.svg';
import { Input } from 'components/UI/Inputs/Input';
import { IWorker, IWorkerDocs } from 'http/types';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import clsx from 'clsx';

import scss from './WorkerInfoCard.module.scss';

interface IWorkerInfoCardProps {
    worker: IWorker;
    workerDocs: IWorkerDocs[];
    halfScreen?: boolean;
}

export const WorkerInfoCard: React.FC<IWorkerInfoCardProps> = ({
    workerDocs,
    worker,
    halfScreen,
}) => {
    if (!worker) {
        return (
            <div className={scss.worker_card_empty}>
                <p style={{ textAlign: 'center' }}>
                    Здесь будет карта работника
                </p>
            </div>
        );
    }

    const inputWrapperClass = clsx({
        [scss.worker_card_input_wrapper]: !halfScreen,
        [scss.worker_card_input_half]: halfScreen,
    });

    return (
        <div className={scss.worker_card_layout}>
            <h2 className={scss.worker_card_title}>Информация о работнике</h2>
            <div className={scss.worker_content}>
                <div className={scss.worker_card_image_wrapper}>
                    {worker?.image ? (
                        <Image
                            style={{ borderRadius: '50%' }}
                            src={worker.image}
                            alt="Изображение работника"
                            fill
                        />
                    ) : (
                        <AvatarSvg style={{ width: '100%', height: '100%' }} />
                    )}
                </div>
                <div className={scss.worker_card_data}>
                    <div className={inputWrapperClass}>
                        <Input
                            label="ФИО"
                            disabled
                            placeholder="-"
                            value={worker.name}
                            name="worker-name"
                            onChange={() => {}}
                        />
                    </div>
                    <div className={inputWrapperClass}>
                        <Input
                            label="Организация"
                            disabled
                            value={worker.org.name ?? ''}
                            name="username"
                            onChange={() => {}}
                        />
                    </div>
                </div>
            </div>
            <div className={scss.worker_card_data_additional}>
                {workerDocs?.map((doc, index) => {
                    return (
                        <div
                            key={index}
                            className={scss.worker_card_input_additional}
                        >
                            <Input
                                errorFontColor={'gray'}
                                label={doc.name}
                                placeholder="-"
                                disabled
                                value={new Date(doc.activeTo)
                                    .toLocaleDateString()
                                    .split('/')
                                    .join('.')}
                                name={doc?.name}
                                onChange={() => {}}
                                handleError={validateDate(doc.activeTo)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
