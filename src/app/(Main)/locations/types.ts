import { Dispatch, SetStateAction } from 'react';
import { IWorker } from 'http/types';
import { ModifiedWorker } from 'app/(Main)/locations/edit/[id]/types';

export interface IData {
    id: string;
    count: number;
    category: string;
}

export interface WorkersPickListWrapperProps {
    source: IWorker[];
    target: ModifiedWorker[];
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
