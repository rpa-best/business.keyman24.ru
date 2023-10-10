import { IObject } from 'http/types';
import React from 'react';

export interface ObjectFormModalProps {
    locId: number;
    object?: IObject;
    setObjects: React.Dispatch<React.SetStateAction<IObject[]>>;
    type: 'create' | 'edit';
}

export interface ObjectFormModalValues {
    name: string;
    desc: string;
}
