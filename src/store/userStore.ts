import { create } from 'zustand';
import * as T from 'store/types';

export const useUserStore = create<T.IUserStore>((set) => ({
    user: null,
    isAuth: false,
    setUser: (user: T.IUser) => set({ user: user }),
    setLogoutUser: () => {
        set({
            user: null,
            isAuth: false,
        });
    },
}));
