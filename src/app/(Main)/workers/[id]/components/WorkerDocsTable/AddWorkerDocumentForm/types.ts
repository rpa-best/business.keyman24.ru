import React from 'react';
import { ModifiedWorkerDocs } from 'app/(Main)/workers/[id]/components/WorkerTables/WorkerTables';

export interface AddWorkerDocumentFormProps {
    id: string;
    setTableData: React.Dispatch<React.SetStateAction<ModifiedWorkerDocs[]>>;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddWorkerFormTypes {
    name: string;
    dateTo: Date | null;
}
