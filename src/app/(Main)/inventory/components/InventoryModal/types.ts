import { ILocation, IType } from 'http/types';

export interface InventoryFormType {
    name: string;
    description: string;
    cost: number;
    location: ILocation | null;
}
