import { IOrganization } from 'store/types';
import React, { useEffect, useState } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { ILocation } from 'http/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { LocationsList } from 'app/(Main)/inventory/components/SelectLocationTippy/LocationsList/LocationsList';
import { Button } from 'components/UI/Buttons/Button';
import { Interval } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy/Interval';
import ExitSvg from '/public/svg/x.svg';
import { getWorkersPlan } from 'http/workerApi';
import FileSaver from 'file-saver';
import { Spinner } from 'components/Spinner';

import scss from './SelectOrgAndIntervalTippy.module.scss';

interface OrgAndIntervalTIppyProps {
    orgs: IOrganization[];
    visible: boolean;
    setVisible: (v: boolean) => void;
    opacity: MotionValue<number>;
}

export const OrgAndIntervalTIppy: React.FC<OrgAndIntervalTIppyProps> = ({
    orgs,
    visible,
    setVisible,
    opacity,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [fromAndToDates, setFromAndToDates] = useState<{
        from?: string;
        to?: string;
    } | null>(null);
    const [currentInterval, setCurrentInterval] = useState<'month' | 'day'>(
        'day'
    );

    const [loading, setLoading] = useState(false);

    const [listValues, setListValues] = useState<
        { id: number; name: string }[]
    >([]);
    const [selectedOrg, setSelectedOrg] = useState<{
        id: number;
        name: string;
    }>();
    const [selectedOrgs, setSelectedOrgs] = useState<
        { id: number; name: string }[]
    >([]);

    const disabled = fromAndToDates?.from && !fromAndToDates.to;

    useEffect(() => {
        const alreadyHas = new Set();
        const filteredNames = orgs?.reduce(
            (accumulator: { id: number; name: string }[], item) => {
                if (item.id) {
                    if (!alreadyHas.has(item.id)) {
                        alreadyHas.add(item.id);
                        accumulator.push({
                            id: item.id,
                            name: item.name,
                        });
                    }
                }
                return accumulator;
            },
            []
        );
        setListValues(filteredNames);
    }, [orgs, refresh]);

    const handleDeleteOne = (id: number) => {
        setListValues((l) => {
            const elem = selectedOrgs.find((el) => el.id === id);
            return [...l, elem as ILocation];
        });
        setSelectedOrgs((l) =>
            l.filter((l) => {
                return l.id !== id;
            })
        );
        setSelectedOrg(undefined);
    };

    const handleInputChange = (v: IOrganization) => {
        setSelectedOrg(v);

        setListValues((lv) => lv.filter((l) => l.id !== v.id));

        setSelectedOrgs((l) => {
            if (l.some((el) => el.id === v.id)) {
                return l;
            }
            return [...l, v];
        });
    };

    console.log(fromAndToDates);

    const handleDownloadExcel = async (format: 'xlsx' | 'xml') => {
        setLoading(true);
        const ids = selectedOrgs.map((el) => el.id).join(',');
        await getWorkersPlan({
            org: ids,
            date_end: fromAndToDates?.to,
            calc_type:
                currentInterval === 'month' ? currentInterval : undefined,
            date_from: fromAndToDates?.from,
            format,
        })
            .then((d) => {
                FileSaver.saveAs(d, 'Учтёт времени');
            })
            .finally(() => {
                setVisible(false);
                setSelectedOrg(undefined);
                setSelectedOrgs([]);
                setRefresh(!refresh);
                setLoading(false);
            });
    };

    return (
        <>
            <motion.div style={{ opacity }} className={scss.tippy_content}>
                <ExitSvg
                    onClick={() => setVisible(false)}
                    className={scss.close}
                />
                <div className={scss.tippy_actions}>
                    <div className={scss.input_select_wrapper}>
                        <p className={scss.tippy_title}>Укажите организацию</p>
                        <InputSelect
                            needErrorLabel={false}
                            placeholder="Выберите организацию"
                            listValues={listValues}
                            name="organizations"
                            onChange={(v: IOrganization) => {
                                handleInputChange(v);
                            }}
                            value={selectedOrg?.name ?? ''}
                        />
                        <LocationsList
                            deleteOne={handleDeleteOne}
                            locations={selectedOrgs}
                        />
                    </div>
                    <Interval
                        currentInterval={currentInterval}
                        setCurrentInterval={setCurrentInterval}
                        refresh={refresh}
                        setDates={setFromAndToDates}
                    />
                </div>
                <div className={scss.download_buttons_wrapper}>
                    <Button
                        disabled={!!disabled}
                        onClick={() => handleDownloadExcel('xlsx')}
                        type="button"
                    >
                        Скачать Excel
                    </Button>
                    <Button
                        disabled={!!disabled}
                        onClick={() => handleDownloadExcel('xml')}
                        type="button"
                    >
                        Скачать 1C
                    </Button>
                </div>
            </motion.div>
            {loading && <Spinner />}
        </>
    );
};
