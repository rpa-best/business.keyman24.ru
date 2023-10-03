import { useEffect, useState } from 'react';
import { allowedPath } from 'http/userApi';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const useAllowedPath = (head: string): boolean => {
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
        const fetchData = async () => {
            return await allowedPath(head, orgId);
        };
        fetchData()
            .catch((e) => e)
            .then((d) => {
                setDeniedLink(d);
            });
    }, [head, orgId]);

    return deniedLink;
};
