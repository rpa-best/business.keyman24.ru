import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

const IdPage = ({ params }: { params: Params }) => {
    return <h1>{params.id}</h1>;
};

export default IdPage;
