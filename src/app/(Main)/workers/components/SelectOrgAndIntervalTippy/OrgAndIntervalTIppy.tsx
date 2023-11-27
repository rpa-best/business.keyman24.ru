import { IOrganization } from 'store/types';
import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { ILocation } from 'http/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { LocationsList } from 'app/(Main)/inventory/components/SelectLocationTippy/LocationsList/LocationsList';
import { Button } from 'components/UI/Buttons/Button';

import scss from './SelectOrgAndIntervalTippy.module.scss';
import { Interval } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy/Interval';
import ExitSvg from '/public/svg/x.svg';
import { getWorkersPlan } from 'http/workerApi';
import FileSaver from 'file-saver';
import { Spinner } from 'components/Spinner';

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
        from: string;
        to: string;
    } | null>(null);
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

    const handleDownloadExcel = async () => {
        setLoading(true);
        const ids = selectedOrgs.map((el) => el.id).join(',');
        await getWorkersPlan({
            org: ids,
            date_end: fromAndToDates?.to,
            date_from: fromAndToDates?.from,
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
                    <Interval refresh={refresh} setDates={setFromAndToDates} />
                </div>
                <div className={scss.button_wrapper}>
                    <Button onClick={() => handleDownloadExcel()} type="button">
                        Скачать
                    </Button>
                </div>
            </motion.div>
            {loading && <Spinner />}
        </>
    );
};
