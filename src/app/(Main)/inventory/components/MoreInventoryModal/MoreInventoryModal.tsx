import React from 'react';
import { usePathname } from 'next/navigation';

import { RowForm } from 'app/(Main)/locations/components/RowForm';
import { PreviewRowsList } from 'app/(Main)/locations/components/PreviewRowsList';
import { Button } from 'components/UI/Buttons/Button';
import { IData } from 'app/(Main)/locations/types';
import { LocKeyBody } from 'http/types';
import { createInventoryKeys } from 'http/inventoryApi';
import { useModalStore } from 'store/modalVisibleStore';
import revalidate from 'utils/revalidate';

import scss from 'app/(Main)/locations/components/KeysWrapper/KeysWrapper.module.scss';

interface MoreInventoryModalProps {
    setData: React.Dispatch<React.SetStateAction<IData[]>>;
    data: IData[];
    setLoading: (v: boolean) => void;
    total: number;
}

export const MoreInventoryModal: React.FC<MoreInventoryModalProps> = ({
    setData,
    data,
    setLoading,
    total,
}) => {
    const path = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const handleDeleteOne = (id: string) => {
        setData(data.filter((d) => d.id !== id));
    };

    const handleGenerateClick = async () => {
        setLoading(true);
        const body: LocKeyBody[] = data.map((d) => {
            return { name: d.category, count: d.count };
        });

        createInventoryKeys(body)
            .then(() => {
                setData([]);
                setVisible(false);
                revalidate(path);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <>
            <h2 className={scss.actions_data_title}>Генерация инвентаря</h2>
            <div className={scss.actions_wrapper}>
                <RowForm setData={setData} />
                <PreviewRowsList deleteOne={handleDeleteOne} data={data} />
            </div>
            <div className={scss.button_wrapper}>
                <Button
                    disabled={data.length === 0}
                    type="button"
                    onClick={() => handleGenerateClick()}
                >
                    Сгенерировать инвентарь
                </Button>
            </div>
        </>
    );
};
