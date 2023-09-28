import { create } from 'zustand';
import * as T from 'store/types';

export const useNotificationStore = create<T.INotificationStore>((set) => ({
    visible: false,
    setVisible: (visible) => set({ visible: visible }),
}));
