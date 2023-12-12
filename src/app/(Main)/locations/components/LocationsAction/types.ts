import { ILocation } from 'http/types';
import React from 'react';
import { IOrganization } from 'store/types';

export type PermissionLocationType = {
    orgs?: boolean;
    workers?: boolean;
} | null;

export interface LocationActionProps {
    formType: 'create' | 'edit';
    location: LocationActionProps['formType'] extends 'create'
        ? null
        : ILocation;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setTableData: React.Dispatch<React.SetStateAction<ILocation[]>>;
    loading: boolean;
    organizations: IOrganization[];
    permissions: PermissionLocationType;
}

export interface LocationFormValues {
    location: string;
    desc: string;
    timezone: { name: string; id: number };
}
