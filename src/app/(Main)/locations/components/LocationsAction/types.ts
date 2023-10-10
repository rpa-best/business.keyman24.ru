import { ILocation } from 'http/types';
import React from 'react';
import { IOrganization } from 'store/types';

export interface LocationActionProps {
    formType: 'create' | 'edit';
    location: LocationActionProps['formType'] extends 'create'
        ? null
        : ILocation;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setTableData: React.Dispatch<React.SetStateAction<ILocation[]>>;
    loading: boolean;
    organizations: IOrganization[];
}

export interface LocationFormValues {
    location: string;
    desc: string;
}
