import { cookies } from 'next/headers';

import { ModifiedWorkers } from 'app/(Main)/workers/types';
import { WorkersTableWrapper } from 'app/(Main)/workers/components/WorkersTableWrapper';
import { getServerWorkers } from 'http/workerApi';
import { WorkersButton } from 'app/(Main)/workers/components/WorkersButton';
import { Modal } from 'components/Modal';
import { WorkersModal } from 'app/(Main)/workers/components/WorkersModal';

import scss from './Worker.module.scss';

const WorkersPage = async () => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const serverWorkers = await getServerWorkers(+orgId);

    const modifiedWorkers: ModifiedWorkers = {
        ...serverWorkers,
        results: serverWorkers.results.map((w) => {
            return { ...w, user: w?.user?.username ?? '-', org: w.org.name };
        }),
    };

    return (
        <div className={scss.children_with_table}>
            <div className={scss.page_title_with_table_back_button}>
                <h1>Работники / список</h1>
                <div className={scss.button_wrapper}>
                    <WorkersButton />
                </div>
            </div>
            <WorkersTableWrapper workers={modifiedWorkers} />
            <Modal>
                <WorkersModal />
            </Modal>
        </div>
    );
};

export default WorkersPage;
