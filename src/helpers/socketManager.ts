import { useEffect, useRef, useState } from 'react';
import UniversalCookies from 'universal-cookie';
import { SocketResponse } from 'http/types';

const cookie = new UniversalCookies();

const access = cookie.get('access');

export const useSocket = (sessionId: number, close?: boolean) => {
    const socket = useRef<WebSocket>();
    const [message, setMessage] = useState<SocketResponse>();

    const createConnection = () => {
        if (!socket.current) {
            socket.current = new WebSocket(
                `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${sessionId}/?token=${access}`
            );
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.onmessage = (event) => {
                setMessage(JSON.parse(event.data));
            };
        }
    }, []);

    return { socket, createConnection, message };
};
