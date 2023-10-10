import {
    ILocation,
    IModifiedSession,
    ISession,
    IType,
    IWorkingArea,
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
    initialAreas: IWorkingArea[];
    locations: ILocation[];
    workingTypes: IType[];
}

export interface SessionWrapperProps {
    sessions: IModifiedSession[];
    areaId: number;
    type: 'register' | 'security' | 'inventory' | 'key' | 'register_inventory';
}
