import {
    ILocation,
    IModifiedSession,
    ISession,
    IType,
    IWorkingArea,
    PermissionsResponseType,
} from 'http/types';
import React from 'react';

export interface IModfiedWorkingArea extends IWorkingArea {
    locationName: string;
    typeName: string;
}

export interface EditWorkingAreaProps {
    formType: 'edit' | 'create';
    editableArea?: IModfiedWorkingArea;
    locations: ILocation[];
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setWorkingAreasData: React.Dispatch<
        React.SetStateAction<IModfiedWorkingArea[]>
    >;
    types: IType[];
}

export interface AreasTableWrapperProps {
    workingAreas: IModfiedWorkingArea[];
    permissions: PermissionsResponseType[];
    count: number;
}

export interface SessionWrapperProps {
    sessions: {
        count: number;
        permissions: PermissionsResponseType[];
        results: IModifiedSession[];
    };
    areaId: number;
    type: 'register' | 'security' | 'inventory' | 'key' | 'register_inventory';
}
