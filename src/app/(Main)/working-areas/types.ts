import {
    ILocation,
    IModifiedSession,
    ISession,
    IType,
    IWorkingArea,
} from 'http/types';

export interface IModfiedWorkingArea
    extends Omit<Omit<IWorkingArea, 'type'>, 'location'> {
    location: string;
    type: string;
}

export interface EditWorkingAreaProps {
    formType: 'edit' | 'create';
    editableArea?: IWorkingArea;
    locations: ILocation[];
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
