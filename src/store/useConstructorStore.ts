import { create } from 'zustand';

export interface IField {
    id: number;
    name: string;
    slug: string;
    count: string;
    max: string;
    min: string;
    notLimited: boolean;
}

export interface IConstructorStore {
    fields: IField[];
    currentPrice: number;
    setCurrentPrice: (v: number) => void;
    setFields: (v: IField[]) => void;
}

export const useConstructorStore = create<IConstructorStore>((set) => ({
    fields: [],
    currentPrice: 0,
    setCurrentPrice: (v) => set({ currentPrice: v }),
    setFields: (fields) => set({ fields }),
}));
