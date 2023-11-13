import { useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const useSocketConnect = (url: string) => {
    const socket = useRef<WebSocket>();

    useEffect(() => {
        if (socket.current) {
            return;
        }

        const access = cookie.get('access');
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}${url}?token=${access}`
        );

        socket.current.onmessage = (ev) => {
            const event = JSON.parse(ev.data);
        };
    }, [url]);

    console.log(socket.current);
};
