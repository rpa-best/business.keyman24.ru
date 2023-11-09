interface FilterData {
    id: number;
    name: string;
    query: string;
}

export const FilterData: FilterData[] = [
    { id: 0, name: 'Уникальные посещения', query: 'uniqueCount' },
    { id: 1, name: 'Входы', query: 'entersCount' },
    { id: 2, name: 'Выходы', query: 'exitsCount' },
];
