import { IWorker } from 'http/types';
import React from 'react';
import { ModifiedRegisterLog } from 'app/(Main)/working-areas/session/[slug]/open/types';

export interface EnterCodeFormValues {
    code: string;
}

export interface EnterCodeFormProps {
    type: 'inventory' | 'keys';
    areaId: number;
    setSessionLog: React.Dispatch<React.SetStateAction<ModifiedRegisterLog[]>>;
    sessionId: number;
    worker: IWorker;
}
