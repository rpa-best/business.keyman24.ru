import {
    ILocation,
    ILocationOrgResponse,
    LocationWorkerResponse,
} from 'http/types';
import { IOrganization } from 'store/types';

export interface LocationEditPage {
    params: { id: string };
}

export interface OrgPickListProps {
    source: ModifiedOrganizationsPickList[];
    target: ModifiedLocOrgPickList[];
}

export interface ModifiedOrganizationsPickList extends IOrganization {
    customDesc: string;
}

export interface ModifiedWorker extends LocationWorkerResponse {
    name: string;
}

export interface ModifiedLocOrgPickList extends ILocationOrgResponse {
    name: string;
    customDesc: string;
}

export interface LocationInfoWrapperProps {
    location?: ILocation;
    type: 'create' | 'edit';
}

export interface LocationInfoWrapperValues {
    name: string;
    desc: string;
}
