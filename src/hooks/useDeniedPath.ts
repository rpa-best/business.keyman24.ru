import { useEffect, useState } from 'react';
import { allowedPath } from 'http/userApi';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const useAllowedPath = (
    head: string,
    size: 'pc' | 'tablet' = 'pc'
): boolean => {
    const [deniedLink, setDeniedLink] = useState<boolean>(false);
    const [orgId, setOrgId] = useState();

    useEffect(() => {
        const orgId = cookies.get('orgId');

        setOrgId(orgId);
    }, []);

    useEffect(() => {
        if (!orgId) {
            return;
        }
        if (size === 'tablet') {
            setDeniedLink(true);
            return;
        }
        const fetchData = async () => {
            return await allowedPath(head, orgId);
        };
        if (head === '/') {
            setDeniedLink(true);
            return;
        }
        fetchData()
            .then((d) => {
                setDeniedLink(d);
            })
            .catch((e) => e);
    }, [head, orgId, size]);

    return deniedLink;
};
