import React, { Dispatch, SetStateAction } from 'react';

export interface IData {
    id: string;
    count: number;
    category: string;
}

export interface WorkersPickListWrapperProps {
    listsRefresh: boolean;
    locId: number;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
}

export interface IGeneratedKeys {
    id: number;
    name: string;
    codeNumber: string;
}

export interface RowFormProps {
    setData: Dispatch<SetStateAction<IData[]>>;
}

export interface PreviewRowsListProps {
    deleteOne: (id: string) => void;
    data: IData[];
}

export interface PreviewListItemProps extends IData {
    deleteOne: (id: string) => void;
}
