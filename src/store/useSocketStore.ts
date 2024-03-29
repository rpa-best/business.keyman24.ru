import { create } from 'zustand';
import * as T from 'store/types';

export const useSocketStore = create<T.ISocketStore>((set) => ({
    socket: null,
    message: null,
    createConnection: (sessionId, access) => {
        set((state) => {
            if (state.socket?.readyState === 1) {
                return state;
            }
            const socket = new WebSocket(
                `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${sessionId}/?token=${access}`
            );

            socket.onmessage = (ev) => {
                const event = JSON.parse(ev.data);
                set({ message: event });
            };

            return {
                socket,
            };
        });
    },

    onClose: (callback) => {
        set((state) => {
            if (state.socket) {
                state.socket.onclose = callback;
            }

            return state;
        });
    },

    closeConnection: () => {
        set(({ socket }) => {
            socket?.close();
            return { ...socket, message: null };
        });
    },
}));
