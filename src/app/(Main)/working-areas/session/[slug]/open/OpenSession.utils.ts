import { closeSession } from 'http/workingAreaApi';
import { CloseSessionType } from 'app/(Main)/working-areas/session/[slug]/open/types';

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
    await closeSession(areaId, sessionId);
    router.replace('/working-areas/session/' + pathSlug);
    setLoading(false);
};
