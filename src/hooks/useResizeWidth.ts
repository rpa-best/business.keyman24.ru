import { useState, useEffect } from 'react';

const tabletBreakpoint = 769;
const pcBreakpoint = 1024;

export const useResizeWidth = () => {
    const [width, setWidth] = useState<number>();

    useEffect(() => {
        setWidth(window.innerWidth);
        const handleResize = (event: Event) => {
            setWidth((event.target as Window).innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        width,
        tabletBreak: (width as number) <= tabletBreakpoint,
        pcBreak: (width as number) <= pcBreakpoint,
    };
};
