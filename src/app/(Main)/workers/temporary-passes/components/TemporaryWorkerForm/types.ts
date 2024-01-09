export interface TemporaryWorkerFormValuesType {
    fullName: string;
    photo: File | null;
    rangeDate: {
        from?: string;
        to?: string;
    } | null;
}
