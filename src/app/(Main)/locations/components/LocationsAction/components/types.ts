import { IOrganization } from 'store/types';
import React from 'react';
import { LocationWorkerResponse } from 'http/types';

export interface OrgPickListProps {
    organizations: IOrganization[];
    locId: number;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setListsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IModifiedOrganization extends IOrganization {
    uuid: string;
}

export interface ModifiedWorker extends LocationWorkerResponse {
    name: string;
    uuid: string;
}
