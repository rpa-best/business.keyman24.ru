'use client';

import React, { useState } from 'react';

import { Spinner } from 'components/Spinner';
import Image from 'next/image';
import AvatarSvg from '/public/svg/avatar.svg';
import { Input } from 'components/UI/Inputs/Input';
import { IWorkerEditFormProps } from 'app/(Main)/workers/types';

import scss from './WorkerEditForm.module.scss';

export const WorkerEditForm: React.FC<IWorkerEditFormProps> = ({ worker }) => {
    const [workerName, setWorkerName] = useState(worker.name);

    return (
        <div className={scss.worker_card_layout}>
            <h2 className={scss.worker_card_title}>Информация о работнике</h2>
            <div className={scss.worker_content}>
                <div className={scss.worker_card_image_wrapper}>
                    {worker?.image ? (
                        <Image
                            src={worker.image}
                            alt="Изображение работника"
                            fill
                        />
                    ) : (
                        <AvatarSvg style={{ width: '100%', height: '100%' }} />
                    )}
                </div>
                <div className={scss.worker_card_data}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            label="ФИО"
                            placeholder="-"
                            value={workerName}
                            name="worker-name"
                            onChange={(e: any) => setWorkerName(e.target.value)}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            placeholder="-"
                            label="Имя пользователя"
                            disabled
                            value={worker?.user?.username ?? ''}
                            name="username"
                            onChange={() => {}}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            label="Организация"
                            disabled
                            value={worker.org.phone ?? ''}
                            name="username"
                            onChange={() => {}}
                        />
                    </div>
                </div>
            </div>
            {/* <div className={scss.worker_card_data_additional}>
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
                                value={doc?.activeTo}
                                name={doc?.name}
                                onChange={() => {}}
                                handleError={validateDate(doc.activeTo)}
                            />
                        </div>
                    );
                })}
            </div>*/}
        </div>
    );
};
