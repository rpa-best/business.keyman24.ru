import { Dispatch, SetStateAction } from 'react';
import { IWorker, LocKeysResponse } from 'http/types';
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

export interface IGeneratedKeys extends LocKeysResponse {}

export interface RowFormProps {
    setData: Dispatch<SetStateAction<IData[]>>;
}

export interface PreviewRowsListProps {
    deleteOne?: (id: string) => void;
    data: IData[];
}

export interface PreviewListItemProps extends IData {
    deleteOne?: (id: string) => void;
}
