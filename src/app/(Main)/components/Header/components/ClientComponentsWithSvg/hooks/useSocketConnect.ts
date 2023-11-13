import { useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { successToastConfig } from 'config/toastConfig';

const cookie = new Cookies();

export const useSocketConnect = (url: string) => {
    const [message, setMessage] = useState<{
        type: string;
        data: { slug: string; name: string };
    }>();
    const socket = useRef<WebSocket>();

    useEffect(() => {
        toast(message?.data.name, successToastConfig);
    }, [message?.data.name]);

    useEffect(() => {
        if (!socket.current?.readyState) {
            const access = cookie.get('access');
            socket.current = new WebSocket(
                `${process.env.NEXT_PUBLIC_API_SOCKET_URL}${url}?token=${access}`
            );

            socket.current.onmessage = (ev) => {
                const event = JSON.parse(ev.data);
                setMessage(event);
            };
        }

        return () => {
            if (socket.current) {
                socket.current?.close();
            }
        };
    }, [url]);
};
