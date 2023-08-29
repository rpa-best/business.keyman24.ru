import { Dispatch, SetStateAction } from 'react';

export interface IData {
    id: string;
    count: number;
    category: string;
}

export interface IGeneratedKeys {
    id: string;
    category: string;
    code: string;
}

export interface RowFormProps {
    setData: Dispatch<SetStateAction<IData[]>>;
}

export interface PreviewRowsListProps {
    deleteOne: (id: string) => void;
    data: IData[];
    deleteAll: () => void;
    handleChange: (id: string, field: string, value: string) => void;
}

export interface PreviewListItemProps extends IData {
    data: IData[];
    handleChange: (id: string, field: string, value: string) => void;
    deleteOne: (id: string) => void;
}
