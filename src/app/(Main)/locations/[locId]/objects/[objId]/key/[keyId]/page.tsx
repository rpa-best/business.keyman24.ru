import React from 'react';
import { cookies } from 'next/headers';
import { getKeyHistory } from 'http/locationsApi';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { BarChart } from 'components/BarChart';

interface KeyPageProps {
    params: {
        locId: string;
        objId: string;
        keyId: string;
    };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params }) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const keyHistory = await getKeyHistory(
        +orgId,
        +params.locId,
        +params.objId,
        +params.keyId
    );

    console.log(keyHistory.results);

    return (
        <>
            <BackButton skipWord={true}>Назад</BackButton>
            {/* <BarChart data={keyHistory.results} />*/}
            <div style={{ color: 'white' }}>
                {keyHistory.results.map((h, i) => (
                    <p
                        style={{ marginBottom: '10px', padding: '10px' }}
                        key={i}
                    >
                        {h.worker.name} {h.mode ? 'Получил' : 'Сдал'}{' '}
                        {h.inventory} {h.date}
                    </p>
                ))}
            </div>
        </>
    );
};

export default KeyPage;
