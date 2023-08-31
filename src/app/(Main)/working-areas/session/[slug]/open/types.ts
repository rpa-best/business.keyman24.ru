import React from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

import { IOrganization } from 'store/types';
import { SessionLogResponse } from 'http/types';

export interface RegisterProps {
    organizations: IOrganization[];
    currentAreaId: number;
    currentSessionId: number;
}

export interface SecurityProps extends Omit<RegisterProps, 'organizations'> {
    sessionLog: SessionLogResponse[];
}

export interface KeyProps extends RegisterProps {
    sessionLog: SessionLogResponse[];
}

export type CloseSessionType = (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    areaId: number,
    sessionId: number,
    pathSlug: string,
    router: AppRouterInstance
) => Promise<void>;
