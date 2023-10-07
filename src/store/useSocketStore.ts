import { create } from 'zustand';
import * as T from 'store/types';

export const useSocketStore = create<T.ISocketStore>((set) => ({
    socket: null,
    createConnection: (sessionId, access) => {
        set((state) => {
            if (state.socket) {
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
    closeConnection: () => {
        set(({ socket }) => {
            socket?.close();
            return { socket: null, message: null };
        });
    },
    message: null,
}));
