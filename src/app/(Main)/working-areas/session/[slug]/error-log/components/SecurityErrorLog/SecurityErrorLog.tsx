'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { Button } from 'components/UI/Buttons/Button';
import { useSocketStore } from 'store/useSocketStore';
import AvatarSvg from '/public/svg/avatar.svg';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import { getWorkerDocs } from 'http/workerApi';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';

import scss from 'app/(Main)/working-areas/session/[slug]/open/components/Security/Security.module.scss';
import { Spinner } from 'components/Spinner';
import Cookies from 'universal-cookie';
import { useParams } from 'next/navigation';
import { getParamsId } from 'app/(Main)/working-areas/helpers';

const cookie = new Cookies();

interface SecurityErrorLogProps {}

export const SecurityErrorLog: React.FC<SecurityErrorLogProps> = () => {
    const { slug } = useParams();

    const socket = useRef<WebSocket>();

    const [message, setMessage] = useState<SocketResponse>();

    const [worker, setWorker] = useState<IWorker | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        errorName: string;
        errorsArray: string[];
    } | null>(null);

    useEffect(() => {
        const access = cookie.get('access');
        const areaId = getParamsId(slug);
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${areaId}/?token=${access}`
        );

        socket.current.onmessage = (ev) => {
            const event = JSON.parse(ev.data);
            setMessage(event);
        };
    }, []);

    useEffect(() => {
        if (message?.type === 'success') {
            return;
        }
        setErrors(null);
        setWorker(null);
        const fetchWorkerDocs = async () => {
            setLoading(true);
            setWorker(message?.data.worker as IWorker);
            await getWorkerDocs(message?.data?.worker?.id as number)
                .then((d) => {
                    d.results.forEach((doc) => {
                        if (validateDate(doc.activeTo)) {
                            setErrors((d) => ({
                                errorsArray: [
                                    ...(d?.errorsArray ?? []),
                                    doc.name + `до ${doc.activeTo}`,
                                ],
                                errorName: 'Документы просрочены',
                            }));
                        }
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchWorkerDocs();
    }, [message]);

    return (
        <div className={scss.errors_log}>
            {worker && (
                <>
                    <div className={scss.error_worker}>
                        <h2>Информация о работнике</h2>
                        <div className={scss.error_worker_card}>
                            <div className={scss.worker_card_image_wrapper}>
                                {worker?.image ? (
                                    <Image
                                        style={{ borderRadius: '50%' }}
                                        src={worker.image}
                                        alt="Изображение работника"
                                        fill
                                    />
                                ) : (
                                    <AvatarSvg
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                )}
                            </div>
                            <div className={scss.worker_info}>
                                <div className={scss.worker_info_item}>
                                    <p className={scss.worker_info_item_desc}>
                                        ФИО
                                    </p>
                                    <p className={scss.worker_info_item_name}>
                                        {worker.name}
                                    </p>
                                </div>
                                <div className={scss.worker_info_item}>
                                    <p className={scss.worker_info_item_desc}>
                                        Организация
                                    </p>
                                    <p className={scss.worker_info_item_name}>
                                        {worker.org.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={scss.worker_errors_log}>
                        <h2>Информация об ошибках</h2>
                        <div className={scss.error_log_table}>
                            <div className={scss.log_table_headers}>
                                <p>Тип ошибки</p>
                                <p>Наименование</p>
                            </div>
                            <div className={scss.log_table_body}>
                                {errors?.errorsArray.map((el, index) => (
                                    <div
                                        className={scss.log_table_body_item}
                                        key={index}
                                    >
                                        <p>{errors?.errorName}</p>
                                        <p>{el}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {loading && <Spinner />}
        </div>
    );
};
