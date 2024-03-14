'use client';
import React, { createContext, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { onHide, onMount } from 'utils/TippyHelper';
import { motion, useSpring } from 'framer-motion';

import { Button } from 'components/UI/Buttons/Button';
import { useModalStore } from 'store/modalVisibleStore';
import {
    getOrganizationContractorsOnClient,
    updateOrg,
} from 'http/organizationApi';

import { SelectOrgAndIntervalTippy } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy';
import { IOrganization } from 'store/types';

import scss from 'app/(Main)/workers/Worker.module.scss';
import Link from 'next/link';
import { getWorkers } from 'http/workerApi';
import FileSaver from 'file-saver';
import { useSearchParams } from 'next/navigation';

export const CalendarContext = createContext<CalendarType | null>(null);

export interface CalendarType {
    visibleButtons: boolean;
    setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WorkersButton = () => {
    const [visibleButtons, setVisibleButtons] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const opacity = useSpring(0);
    const params = useSearchParams();

    const [orgs, setOrgs] = useState<IOrganization[]>([]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const handleRefreshClick = async () => {
        await updateOrg();
    };

    const handleDownloadBarcodes = async () => {
        const barcodes = await getWorkers(undefined, undefined, 'pdf');

        FileSaver.saveAs(barcodes as unknown as Blob, 'Штрихкоды сотрудников');
    };

    useEffect(() => {
        const fetchOrgs = async () => {
            return await getOrganizationContractorsOnClient();
        };

        fetchOrgs().then((d) => setOrgs(d));
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <Tippy
                onMount={() => onMount(opacity)}
                onHide={({ unmount }) => onHide({ opacity, unmount })}
                animation={true}
                visible={visibleButtons}
                interactive={true}
                placement="left-start"
                offset={[50, -15]}
                onClickOutside={() => {
                    if (calendarOpen) {
                        return;
                    }
                    setVisibleButtons(!visibleButtons);
                }}
                render={() => (
                    <motion.div
                        className={scss.buttons_tippy_wrapper}
                        style={{ opacity }}
                    >
                        <Button
                            onClick={() => handleRefreshClick()}
                            type="button"
                        >
                            Обновить данные
                        </Button>
                        <Button
                            onClick={() => {
                                setVisibleButtons(false);
                                setVisible(true);
                            }}
                            type="button"
                        >
                            Загрузить работников
                        </Button>
                        <Link href="workers/temporary-passes">
                            <Button onClick={() => {}} type="button">
                                Гости и работники
                            </Button>
                        </Link>
                        {params.get('not_working') ? (
                            <Link href="workers">
                                <Button onClick={() => {}} type="button">
                                    Показать работающих
                                </Button>
                            </Link>
                        ) : (
                            <Link href="workers?not_working=true">
                                <Button onClick={() => {}} type="button">
                                    Показать уволенных
                                </Button>
                            </Link>
                        )}
                        <CalendarContext.Provider
                            value={{ setCalendarOpen, visibleButtons }}
                        >
                            <SelectOrgAndIntervalTippy orgs={orgs} />
                        </CalendarContext.Provider>
                        <Button onClick={handleDownloadBarcodes} type="button">
                            Скачать ШК работников
                        </Button>
                    </motion.div>
                )}
            >
                <div>
                    <Button
                        onClick={() => setVisibleButtons(true)}
                        type="button"
                    >
                        Действия
                    </Button>
                </div>
            </Tippy>
        </div>
    );
};
