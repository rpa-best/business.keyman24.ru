import { cookies } from 'next/headers';

import { ModifiedWorkers } from 'app/(Main)/workers/types';
import { WorkersTableWrapper } from 'app/(Main)/workers/components/WorkersTableWrapper';
import { getServerWorkers } from 'http/workerApi';

import scss from './Worker.module.scss';
import { BackButton } from 'components/UI/Buttons/BackButton';

const WorkersPage = async () => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const serverWorkers = await getServerWorkers(+orgId);

    const modifiedWorkers: ModifiedWorkers = {
        ...serverWorkers,
        results: serverWorkers.results.map((w) => {
            return { ...w, user: w?.user?.username ?? '-' };
        }),
    };

    return (
        <div className={scss.children_with_table}>
            <h1 className={scss.page_title_with_table}>Работники / список</h1>
            <WorkersTableWrapper workers={modifiedWorkers} />
        </div>
    );
};

export default WorkersPage;
