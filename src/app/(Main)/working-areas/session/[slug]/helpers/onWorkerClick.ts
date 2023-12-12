import { checkAccess } from 'utils/checkAccess';
import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const onWorkerClick = async (workerId: number) => {
    const orgId = cookie.get('orgId');
    await checkAccess(`business/${orgId}/worker/`).then((d) => {
        if (d) {
            window.open(
                `https://${window.location.host}/workers/${workerId}?which=docs`,
                '_blank'
            );
        } else {
            toast('Недостаточно прав', warningToastConfig);
        }
    });
};
