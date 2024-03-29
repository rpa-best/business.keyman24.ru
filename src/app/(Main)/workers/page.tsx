import { cookies } from 'next/headers';

import { ModifiedWorkers } from 'app/(Main)/workers/types';
import { WorkersTableWrapper } from 'app/(Main)/workers/components/WorkersTableWrapper';
import { getServerWorkers } from 'http/workerApi';
import { WorkersButton } from 'app/(Main)/workers/components/WorkersButton';
import { Modal } from 'components/Modal';
import { WorkersModal } from 'app/(Main)/workers/components/WorkersModal';

import scss from './Worker.module.scss';

const WorkersPage = async ({
    searchParams,
}: {
    searchParams: { offset: string; not_working: string };
}) => {
    const cookieStore = cookies();

    const offset = searchParams.offset ?? '0';
    const notWorking = searchParams.not_working;

    const orgId = cookieStore.get('orgId')?.value as string;

    const serverWorkers = await getServerWorkers(
        +orgId,
        offset,
        false,
        Boolean(notWorking)
    );

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
            <WorkersTableWrapper
                permissions={serverWorkers.permissions}
                workers={modifiedWorkers}
            />
            <Modal>
                <WorkersModal />
            </Modal>
        </div>
    );
};

export default WorkersPage;
