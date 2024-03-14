import { ILocation, IType } from 'http/types';

export interface WorkAreaValues {
    name: string;
    description: string;
    location: ILocation;
    type: IType;
    outForcibly: boolean;
}
