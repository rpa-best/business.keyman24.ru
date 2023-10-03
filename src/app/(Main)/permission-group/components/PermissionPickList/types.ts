import { DefaultElem } from 'components/PickList/types';
import React from 'react';

export interface CustomGroupDefaultElem extends DefaultElem {
    group: number;
    type: string;
}

export interface WorkingAreaPickList {
    groupId: number;
    id: number;
    levelId: number;
}
