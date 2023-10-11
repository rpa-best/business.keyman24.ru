import { closeSession } from 'http/workingAreaApi';
import { CloseSessionType } from 'app/(Main)/working-areas/session/[slug]/open/types';
import revalidate from 'utils/revalidate';

export const validateDate = (date: string) => {
    const propDate = new Date(date);
    if (propDate.getTime() <= Date.now()) {
        return 'Просрочен';
    } else return undefined;
};

export const closeSessionHandler: CloseSessionType = async (
    setLoading,
    areaId,
    sessionId,
    pathSlug,
    router
) => {
    setLoading(true);
    await closeSession(areaId, sessionId)
        .then(() => {
            revalidate('/working-areas/session/' + pathSlug);
            router.replace('/working-areas/session/' + pathSlug);
        })
        .finally(() => {
            setLoading(false);
        });
};
