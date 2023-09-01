import React from 'react';
import { CustomGroupDefaultElem } from 'app/(Main)/permission-group/components/PermissionPickList/types';

export interface WorkingAreaDevicePickList {
    target: CustomGroupDefaultElem[];
    source: CustomGroupDefaultElem[];
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    areaId: number;
}
