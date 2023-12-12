'use client';

import { useEffect } from 'react';

export default function ErrorComponent({
    error,
}: {
    error: Error & { digest?: string };
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.log(error);
    }, [error]);

    return <div>Пиздец</div>;
}
