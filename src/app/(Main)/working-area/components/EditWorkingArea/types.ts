import { ILocation, IType } from 'http/types';

export interface EditValues {
    name: string;
    description: string;
    location: ILocation;
    type: IType;
}
