import { IField } from 'store/useConstructorStore';
import { IRate } from 'http/types';
import { updateSub } from 'http/organizationApi';
import { toast } from 'react-toastify';

type DeleteSubProps = (
    fields: IField[],
    slug: string,
    count: number,
    type: 'add' | 'del'
) => void;

export const subAction: DeleteSubProps = (fields, slug, count, type) => {
    const field = fields.find((el) => {
        return el.slug === slug;
    });

    const newField: IRate = {
        id: field?.id as number,
        key: field?.slug as string,
        value:
            type === 'del'
                ? +(field as IField).count - count
                : +(field as IField).count + count,
        not_limited: field?.notLimited as boolean,
    };

    updateSub([newField]).catch(() => {
        toast('Ошибка в обновлении подписки', {
            position: 'bottom-right',
            hideProgressBar: true,
            autoClose: 2000,
            type: 'error',
            theme: 'colored',
        });
    });
};
