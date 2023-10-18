import { useEffect, useRef } from 'react';

export const useDebounce = (
    callback: (...args: any[]) => Promise<void> | void,
    delay: number
) => {
    const timerId = useRef<any>();

    useEffect(() => {
        timerId.current = setTimeout(() => {
            callback();
        }, delay);

        return () => {
            clearTimeout(timerId.current);
        };
    }, [callback, delay]);
};
