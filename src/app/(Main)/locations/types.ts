import { Dispatch, SetStateAction } from 'react';
import { IInventory, IWorker, LocKeysResponse } from 'http/types';
import { ModifiedWorker } from 'app/(Main)/locations/edit/[id]/types';

export interface IData {
    id: string;
    count: number;
    category: string;
}

export interface WorkersPickListWrapperProps {
    listsRefresh: boolean;
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
