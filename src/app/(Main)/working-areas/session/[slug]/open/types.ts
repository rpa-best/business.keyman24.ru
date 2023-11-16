import React from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

import { IOrganization } from 'store/types';
import { SessionLogResponse } from 'http/types';

export interface RegisterProps {
    organizations: IOrganization[];
    currentAreaId: number;
    currentSessionId: number;
    sessionLog: ModifiedRegisterLog[];
    areaName: string;
}

export interface SecurityProps
    extends Omit<RegisterProps, 'organizations' | 'sessionLog'> {
    areaName: string;
    sessionLog: Omit<ModifiedRegisterLog, 'inventoryName'>[];
}

export interface ModifiedRegisterLog extends SessionLogResponse {
    workerName: string;
    modeName: string;
    inventoryName: string;
}

export interface KeyProps extends RegisterProps {
    areaName: string;
    type: 'inventory' | 'keys';
}

export interface RegisterInventoryProps
    extends Omit<RegisterProps, 'sessionLog'> {
    sessionLog: Omit<ModifiedRegisterLog, 'workerName'>[];
    areaName: string;
}

export type CloseSessionType = (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    areaId: number,
    sessionId: number,
    pathSlug: string
) => Promise<void>;
