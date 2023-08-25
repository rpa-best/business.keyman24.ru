import React from 'react';

interface ClosedSessionProps {
    params: { id: string };
}

const ClosedSessionPage: React.FC<ClosedSessionProps> = ({ params }) => {
    return <h1>{params.id}</h1>;
};

export default ClosedSessionPage;
