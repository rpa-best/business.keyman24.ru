import { ILocation } from 'http/types';

export interface LocationEditPage {
    params: { id: string };
}

export interface LocationInfoWrapperProps {
    location: ILocation;
    type: 'create' | 'edit';
}

export interface LocationInfoWrapperValues {
    name: string;
    desc: string;
}
