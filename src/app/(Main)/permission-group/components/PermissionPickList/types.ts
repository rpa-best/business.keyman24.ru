import { DefaultElem } from 'components/PickList/types';
import React from 'react';

export interface CustomGroupDefaultElem extends DefaultElem {
    group: number;
    type: string;
}

export interface WorkingAreaPickList {
    target: CustomGroupDefaultElem[];
    source: CustomGroupDefaultElem[];
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    groupId: number;
}
