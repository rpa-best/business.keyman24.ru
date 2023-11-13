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
import { AxiosError } from 'axios';

const cookie = new Cookies();

interface SecurityErrorLogProps {}

export const SecurityErrorLog: React.FC<SecurityErrorLogProps> = () => {
    const { slug } = useParams();

    const socket = useRef<WebSocket>();

    const [message, setMessage] = useState<SocketResponse>();

    const [worker, setWorker] = useState<IWorker | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<
        {
            errorName: string;
            errorValue: string;
        }[]
    >([]);

    useEffect(() => {
        const access = cookie.get('access');
        const areaId = getParamsId(slug);
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/working_area/${areaId}/?token=${access}`
        );

        socket.current.onmessage = (ev) => {
            const event = JSON.parse(ev.data);
            setErrors([]);
            setWorker(null);
            setMessage(event);
        };

        return () => {
            if (socket.current) {
                socket.current?.close();
            }
        };
    }, []);

    useEffect(() => {
        if (message?.type === 'success') {
            return;
        }
        const fetchWorkerDocs = async () => {
            setLoading(true);
            setWorker(message?.data.worker as IWorker);
            if (message?.data.error.slug !== 'end_doc_date_time_worker') {
                setErrors((errors) => [
                    ...errors,
                    {
                        errorValue: message?.data.error.name as string,
                        errorName: 'Ошибка',
                    },
                ]);
            }

            if (message?.data?.inventory) {
                message?.data?.inventory.map((el) => {
                    setErrors((err) => [
                        ...err,
                        {
                            // @ts-ignore
                            errorValue: `${el.type.name} ${el.code_number}`,
                            errorName: `Несданный ${el.type.name}`,
                        },
                    ]);
                });
            }

            await getWorkerDocs(message?.data?.worker?.id as number)
                .then((d) => {
                    d.results.forEach((doc) => {
                        if (validateDate(doc.activeTo)) {
                            setErrors((d) => [
                                ...d,
                                {
                                    errorValue:
                                        doc.name +
                                        ` ${new Date(
                                            doc.activeTo.split('-').join('.')
                                        ).toLocaleDateString()}`,
                                    errorName: 'Документы просрочены',
                                },
                            ]);
                        }
                    });
                })
                .catch((e) => {
                    if (e instanceof AxiosError && e.response?.status === 404) {
                        setWorker({
                            // @ts-ignore
                            org: {
                                name: 'Не найдено',
                            },
                            name: 'Не найден',
                        });
                    }
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
                                {errors.map((el, index) => (
                                    <div
                                        className={scss.log_table_body_item}
                                        key={index}
                                    >
                                        <p>{el.errorName}</p>
                                        <p>{el.errorValue}</p>
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
