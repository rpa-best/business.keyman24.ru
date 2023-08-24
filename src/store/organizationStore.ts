import { create } from 'zustand';
import * as T from 'store/types';

export const useOrganizationStore = create<T.IOrganizationStore>((set) => ({
    organization: null,
    setOrganization: (organization) => set({ organization: organization }),
}));
