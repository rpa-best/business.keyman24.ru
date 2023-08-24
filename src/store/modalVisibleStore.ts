import { create } from 'zustand';
import * as T from 'store/types';

export const useModalStore = create<T.IModalStore>((set) => ({
    visible: false,
    setVisible: (visible) => set({ visible: visible }),
}));
