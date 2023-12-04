import { $clientAuth } from 'http/indexes/clientIndex';
import { AxiosError } from 'axios';

export const checkAccess = async (url: string) => {
    try {
        const res = await $clientAuth.get(url + '?limit=1&offset=0');
        if (res.status !== 403) {
            return true;
        }
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 403) {
                return false;
            }
        }
    }
};
