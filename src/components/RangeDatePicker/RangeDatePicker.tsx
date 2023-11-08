import { forwardRef, MouseEventHandler, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { warningToastConfig } from 'config/toastConfig';
import { toast } from 'react-toastify';

import CalendarSvg from 'components/UI/Inputs/InputDate/icons/Calendar.svg';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';
import scss from './PickDate.module.scss';

interface PickDateProps {
    start: Date;
    end: Date;
    setStart: (o: Date) => void;
    setEnd: (o: Date) => void;
}

export const RangeDatePicker = ({
    end,
    start,
    setStart,
    setEnd,
}: PickDateProps) => {
    const query = useSearchParams();

    const [startDate, setStartDate] = useState<Date>(start);
    const [endDate, setEndDate] = useState<Date>(end);

    const startQuery = query.get('start');
    const endQuery = query.get('end');

    const onChange = (dates: Date[]) => {
        const [start, end] = dates;
        if (+start > Date.now()) {
            toast('Дата не может быть больше сегодняшней', warningToastConfig);
            return;
        }
        setStartDate(start);
        setEndDate(end);
    };

    // eslint-disable-next-line react/display-name
    const CustomInput = forwardRef<
        HTMLDivElement,
        { value: string; onClick: MouseEventHandler<HTMLDivElement> }
    >(({ value, onClick }, ref) => {
        let visibleValue = (value = value.replace(/\//g, '.')).trim();
        if (/-$/.test(value.trim())) {
            visibleValue = value.replace(/\//g, '.').replace(/-/g, '').trim();
        }
        return (
            <div onClick={onClick} className={scss.custom_input} ref={ref}>
                <CalendarSvg className={scss.custom_input_svg} />
                <button style={{ cursor: 'pointer' }}>
                    {visibleValue ? visibleValue : 'Другая дата'}
                </button>
            </div>
        );
    });

    useEffect(() => {
        if (!startQuery && !endQuery) {
            setStartDate(start);
            setEndDate(end);
        }
    }, [end, endQuery, start, startQuery]);

    useEffect(() => {
        if (!startDate && !endDate) {
            const newEnd = new Date();
            const newStart = new Date(
                new Date().setMonth(new Date().getMonth() - 1)
            );

            setStart(newStart);
            setStartDate(newStart);
            setEndDate(newEnd);
            setEnd(newEnd);
        }
    }, [endDate, startDate]);

    return (
        <div className={scss.date_picker_wrapper}>
            <DatePicker
                locale={ru}
                calendarClassName={scss.another_date}
                isClearable={true}
                dateFormat="dd/MM/yyyy"
                onChange={(e) => {
                    onChange(e as Date[]);
                }}
                popperClassName={scss.popper_class}
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                customInput={<CustomInput />}
                onCalendarClose={() => {
                    if (startDate && !endDate) {
                        toast('Конечная дата не выбрана', warningToastConfig);
                        return;
                    }
                    setStart(startDate);
                    setEnd(endDate);
                }}
                clearButtonClassName={scss.clear_button}
                selected={null}
                startDate={startDate}
                endDate={endDate}
                portalId="root"
                selectsRange
            />
        </div>
    );
};
