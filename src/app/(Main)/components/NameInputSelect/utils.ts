import { IResponse } from 'http/types';
import { ReadonlyURLSearchParams } from 'next/navigation';
import React from 'react';

type GetUniqueNames = (
    d: IResponse<{ name: string }>,
    searchParams: ReadonlyURLSearchParams,
    setAllKeys: React.Dispatch<
        React.SetStateAction<{ id: number; name: string }[]>
    >,
    setSearchName: React.Dispatch<React.SetStateAction<string>>
) => void;

export const getUniqueNames: GetUniqueNames = (
    d,
    searchParams,
    setAllKeys,
    setSearchName
) => {
    const alreadyHas = new Set();
    const names = (d?.results as { name: string }[]).reduce(
        (accumulator: { id: number; name: string }[], item, index) => {
            if (!alreadyHas.has(item.name)) {
                alreadyHas.add(item.name);
                accumulator.push({ id: index, name: item.name });
            }
            return accumulator;
        },
        []
    );
    const lastId = names.at(-1)?.id as number;
    const result: { id: number; name: string }[] = [
        { id: lastId + 1, name: 'Все' },
        ...names,
    ];
    setAllKeys(result);
    if (!searchParams.get('name')) {
        setSearchName(result[0].name);
    }
};
