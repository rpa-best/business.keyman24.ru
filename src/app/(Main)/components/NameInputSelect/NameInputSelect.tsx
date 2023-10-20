import React, { useEffect, useState } from 'react';

import { getLocationClientKeys } from 'http/locationsApi';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { setSearchParams } from 'utils/setSearchParams';
import { getClientInventories } from 'http/inventoryApi';
import { IInventory, IResponse } from 'http/types';
import { getUniqueNames } from 'app/(Main)/components/NameInputSelect/utils';
import { deleteSearchParams } from 'utils/deleteSearchParams';
import { SearchParamsHelper } from 'utils/searchParamsHelper';

interface NameInputSelectProps {
    type: 'key' | 'inventory';
}

export const NameInputSelect: React.FC<NameInputSelectProps> = ({ type }) => {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const searchHelper = new SearchParamsHelper(searchParams.entries);

    const [searchName, setSearchName] = useState<string>(
        decodeURI(searchParams.get('name') ?? 'Все')
    );
    const [allKeys, setAllKeys] = useState<{ id: number; name: string }[]>([]);

    const { objId, locId } = params;

    const handleInputChange = (el: { id: number; name: string }) => {
        setSearchName(el.name);
        searchHelper.set('name', el.name);

        if (type === 'inventory') {
            searchHelper.getParams.delete('location');
        }

        router.replace(pathname + `?${searchHelper.getParams}`);
    };

    useEffect(() => {
        if (type === 'key') {
            const fetchNames = async () => {
                return await getLocationClientKeys(+locId, +objId);
            };
            fetchNames().then((d) => {
                getUniqueNames(d, searchParams, setAllKeys, setSearchName);
            });
        }
    }, [locId, objId, type]);

    useEffect(() => {
        if (type === 'inventory') {
            const fetchNames = async () => {
                return await getClientInventories('Все');
            };
            fetchNames().then((d) => {
                getUniqueNames(d, searchParams, setAllKeys, setSearchName);
            });
        }
    }, [locId, objId, type]);

    return (
        <InputSelect
            needErrorLabel={false}
            label="Сортировка по названию"
            autoComplete="off"
            placeholder="Поиск по названию"
            listValues={allKeys}
            onChange={handleInputChange}
            value={searchName}
            name="searchValue"
        />
    );
};
