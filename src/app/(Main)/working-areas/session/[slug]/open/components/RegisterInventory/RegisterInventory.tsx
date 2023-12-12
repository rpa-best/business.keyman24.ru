'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { EnterCodeForm } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm';
import { RegisterInventoryProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Spinner } from 'components/Spinner';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { getParamsId } from 'app/(Main)/working-areas/helpers';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from './RegisterInventory.module.scss';

export const RegisterInventory: React.FC<RegisterInventoryProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
    permissions,
}) => {
    const router = useRouter();
    const params = useParams();

    const [sessionLogData, setSessionLogData] =
        useState<typeof sessionLog>(sessionLog);

    const [loading, setLoading] = useState(false);

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'register_inventory-' + getParamsId(params.slug)
        );
        router.replace(
            '/working-areas/session/register_inventory-' +
                getParamsId(params.slug)
        );
    };

    return (
        <>
            <div className={scss.page_title_with_table_back_button}>
                <h1>{areaName}</h1>
                <BackButton skipWord>Назад</BackButton>
            </div>
            <div className={scss.key_layout}>
                {permissions.includes('DELETE') && (
                    <div className={scss.button_wrapper}>
                        <Button
                            onClick={() => onCloseSessionClick()}
                            type="button"
                        >
                            Завершить сессию
                        </Button>
                    </div>
                )}
                <div className={scss.key_content}>
                    <div className={scss.content_wrapper}>
                        <EnterCodeForm
                            needWorker={false}
                            setSessionLog={setSessionLogData}
                            type="registerInventory"
                            sessionId={currentSessionId}
                            areaId={currentAreaId}
                        />
                    </div>
                    <div className={scss.content_table_wrapper}>
                        <Table
                            tableData={sessionLogData}
                            setTableData={setSessionLogData}
                        >
                            <Column header="Дата" field="date" />
                            <Column header="Событие" field="modeName" />
                            <Column
                                header="Наименование"
                                field="inventoryName"
                            />
                        </Table>
                    </div>
                </div>

                {loading && <Spinner />}
            </div>
        </>
    );
};
