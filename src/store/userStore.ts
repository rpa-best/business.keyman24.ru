import { create } from 'zustand';
import * as T from 'store/types';
import { useRouter } from 'next/navigation';

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
