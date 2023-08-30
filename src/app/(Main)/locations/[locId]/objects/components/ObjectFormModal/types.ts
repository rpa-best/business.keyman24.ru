import { IObject } from 'http/types';

export interface ObjectFormModalProps {
    locId: number;
    object?: IObject;
    type: 'create' | 'edit';
}

export interface ObjectFormModalValues {
    name: string;
    desc: string;
}
