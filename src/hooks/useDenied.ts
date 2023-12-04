import { useEffect, useState } from 'react';

type UseDeniedProps = (path: string, ...rest: string[]) => void;

export const useDenied: UseDeniedProps = (path, ...rest) => {
    const [deniedComponents, setDeniedComponents] = useState<string[]>();

    useEffect(() => {
        setDeniedComponents(rest);
    }, [rest, path]);

    return deniedComponents;
};
