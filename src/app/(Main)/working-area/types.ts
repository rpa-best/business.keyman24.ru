import { ILocation, IType, IWorkingArea } from 'http/types';

export interface IModfiedWorkingArea
    extends Omit<Omit<IWorkingArea, 'type'>, 'location'> {
    location: string;
    type: string;
}

export interface EditWorkingAreaProps {
    locations: ILocation[];
    types: IType[];
}

export interface AreasTableWrapperProps {
    workingAreas: IModfiedWorkingArea[];
    locations: ILocation[];
    workingTypes: IType[];
}
