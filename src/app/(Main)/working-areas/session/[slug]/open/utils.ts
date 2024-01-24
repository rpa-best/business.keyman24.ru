import { sendActivateSession, sendCheck } from 'http/workingAreaApi';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorToastOptions } from 'config/toastConfig';

export const sendActivateAndCheck = async (
    sessionId: number,
    areaId: number,
    username?: string
) => {
    await sendActivateSession(areaId, sessionId)
        .catch((e) => {
            if (e instanceof AxiosError) {
                if (e.response?.data.error) {
                    toast(e.response?.data.error[0].name);
                }
            }
        })
        .then((d) => {
            const body = {
                user: username as string,
                session: sessionId,
            };
            sendCheck(areaId, sessionId, body)
                .then(() => {})
                .catch((e: unknown) => {
                    if (e instanceof AxiosError) {
                        if (e.response?.data.error) {
                            toast(
                                e.response?.data.error[0].name,
                                errorToastOptions
                            );
                        }
                        toast(e.response?.data.user[0].name, errorToastOptions);
                    }
                });
        });
};
