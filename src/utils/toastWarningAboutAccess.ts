import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';
import { AxiosError } from 'axios';

export const toastWarningAboutAccess = (e: any) => {
    if (e instanceof AxiosError) {
        if (e.response?.status === 403) {
            toast('Недостаточно прав', warningToastConfig);
            return;
        }
    }
};
