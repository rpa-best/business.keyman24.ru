import { IWorker } from 'http/types';
import React from 'react';
import { ModifiedRegisterLog } from 'app/(Main)/working-areas/session/[slug]/open/types';

export interface EnterCodeFormValues {
    code: string;
}

export type CurrentSessionLogType =
    | ModifiedRegisterLog
    | Omit<ModifiedRegisterLog, 'workerName'>;

export interface EnterCodeFormProps {
    type: 'inventory' | 'keys' | 'registerInventory';
    confirmed?: boolean;
    setConfirmed?: (b: boolean) => void;
    areaId: number;
    setSessionLog: React.Dispatch<
        React.SetStateAction<CurrentSessionLogType[]>
    >;
    temporaryLog?: CurrentSessionLogType[];
    setTemporaryLog?: React.Dispatch<
        React.SetStateAction<CurrentSessionLogType[]>
    >;
    sessionId: number;
    needWorker?: boolean;
    worker?: IWorker;
}
