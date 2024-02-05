import { cookies } from 'next/headers';

import { getOrgById, getServerPrice, getServices } from 'http/organizationApi';
import { SubConstructor } from 'app/(Main)/org-settings/bill/components/SubConstructor';
import { IRate } from 'http/types';
import { PaymentButton } from 'app/(Main)/org-settings/bill/components/PaymentButton/PaymentButton';
import { Modal } from 'components/Modal';
import { ModalPayment } from 'app/(Main)/org-settings/bill/components/ModalPayment';

import scss from './Bill.module.scss';

const BillPage = async () => {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value as string;

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

    const price = await getServerPrice(rateBody, { prime: org.prime });

    console.log(price);

    function addDays(date: Date, days: number) {
        const result = new Date(date);
        result.setDate(date.getDate() + days);
        return result.toLocaleDateString('ru');
    }

    const today = new Date();

    const days = +(org.balance / (price.cost / 30)).toFixed(0);

    const enoughUntil = addDays(today, days);

    return (
        <div className={scss.page_layout}>
            <div className={scss.bill_balance_actions}>
                <p className={scss.bill_balance}>
                    Баланс:{' '}
                    <span className={scss.balance_count}>{org.balance} ₽</span>
                </p>
                <PaymentButton />
            </div>
            <div className={scss.bill_balance}>
                <div className={scss.bill_advantages}>
                    <p>Текущая цена: </p>
                    <div>
                        <span
                            data-hasprime={org.prime}
                            className={scss.balance_count}
                        >
                            {price.cost} ₽{' '}
                        </span>
                        {org.prime && (
                            <p className={scss.prime_cost}>
                                Ваша цена:{' '}
                                <span className={scss.prime_cost}>
                                    {' '}
                                    {price.costPrime} ₽
                                </span>
                            </p>
                        )}
                    </div>
                    / месяц;
                </div>
                <div>
                    <p className={scss.enough_until}>хватит до</p>
                    <span className={scss.balance_count}> ~{enoughUntil}</span>
                </div>
            </div>
            <SubConstructor />
            <Modal>
                <ModalPayment />
            </Modal>
        </div>
    );
};

export default BillPage;
