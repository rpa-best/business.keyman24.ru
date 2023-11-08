import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { forwardRef, MouseEventHandler, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import Input from 'react-input-mask';

import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { formatDate } from 'utils/formatDate';
import CalendarSvg from 'components/UI/Inputs/InputDate/icons/Calendar.svg';

import 'react-datepicker/dist/react-datepicker.css';
import scss from 'components/RangeDatePicker/PickDate.module.scss';
import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';

export const SingleDayPicker = () => {
    const pathname = usePathname();

    const router = useRouter();
    const query = useSearchParams();
    const queryHelper = new SearchParamsHelper(query.entries);

    const dateQuery = query.get('date_lt') ?? Date.now();

    const [selectedValue, setSelectedValue] = useState(
        new Date(dateQuery as string)
    );

    const handleChangeDate = (d: Date, query: string) => {
        if (!d) {
            queryHelper.getParams.delete(query);
            router.replace(pathname + `?${queryHelper.getParams}`);
            return;
        }
        setSelectedValue(d);
        queryHelper.set(query, formatDate(d));
        router.replace(pathname + `?${queryHelper.getParams}`, {
            scroll: false,
        });
    };

    return (
        <div className={scss.date_picker_wrapper}>
            <DatePicker
                locale={ru}
                dateFormat="dd.MM.yyyy"
                calendarClassName={scss.another_date}
                selected={selectedValue}
                onChange={(date) => {
                    if ((date as Date) > new Date()) {
                        toast(
                            'Дата не может быть больше сегодняшней',
                            warningToastConfig
                        );
                        return;
                    }
                    handleChangeDate(date as Date, 'date_lt');
                    handleChangeDate(date as Date, 'date_gt');
                }}
                customInput={
                    <Input
                        className={scss.custom_input_single}
                        mask="99.99.9999"
                        alwaysShowMask={true}
                    />
                }
            />
            <CalendarSvg className={scss.custom_input_svg_single} />
        </div>
    );
};
