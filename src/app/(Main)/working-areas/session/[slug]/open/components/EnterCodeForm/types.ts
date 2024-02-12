import { IWorker } from 'http/types';
import React from 'react';
import { ModifiedRegisterLog } from 'app/(Main)/working-areas/session/[slug]/open/types';

export interface EnterCodeFormValues {
    code: string;
}

export type CurrentSessionLogType =
    | ModifiedRegisterLog
    | Omit<ModifiedRegisterLog, 'workerName'>;

export interface CurrentSessionRegisterLogType
    extends Omit<ModifiedRegisterLog, 'workerName' | 'worker'> {
    responsible?: string;
}

export interface EnterCodeFormProps {
    type: 'inventory' | 'keys' | 'registerInventory';
    confirmed?: boolean;
    setConfirmed: (b: boolean) => void;
    areaId: number;
    setSessionLog: React.Dispatch<
        React.SetStateAction<CurrentSessionLogType[]>
    >;
    temporaryLog: (CurrentSessionLogType | CurrentSessionRegisterLogType)[];
    setTemporaryLog: React.Dispatch<
        React.SetStateAction<
            (CurrentSessionLogType | CurrentSessionRegisterLogType)[]
        >
    >;
    sessionId: number;
    needWorker?: boolean;
    worker?: IWorker;
}
