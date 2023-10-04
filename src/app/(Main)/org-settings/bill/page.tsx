import { cookies } from 'next/headers';

import { getOrgById, getServerPrice, getServices } from 'http/organizationApi';
import { SubConstructor } from 'app/(Main)/org-settings/bill/components/SubConstructor';
import { IRate } from 'http/types';

import scss from './Bill.module.scss';
import { PaymentButton } from 'app/(Main)/org-settings/bill/components/PaymentButton/PaymentButton';

const BillPage = async () => {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value ?? 1;

    const org = await getOrgById(+id);

    const subs = await getServices(+id);

    const rateBody: IRate[] = subs.serviceRates.map((item) => {
        return {
            id: item.id,
            value: +item.value,
            key: item.key.modelName,
            not_limited: item.notLimited,
        };
    });

    const price = await getServerPrice(rateBody);

    return (
        <div className={scss.page_layout}>
            <div className={scss.bill_balance_actions}>
                <p className={scss.bill_balance}>
                    Баланс:{' '}
                    <span className={scss.balance_count}>{org.balance} ₽</span>
                </p>
                <PaymentButton />
            </div>

            <p className={scss.bill_balance}>
                Текущая цена:{' '}
                <span className={scss.balance_count}>{price.cost} ₽ </span> /
                месяц
            </p>
            <SubConstructor defaultPrice={price.cost} />
        </div>
    );
};

export default BillPage;
