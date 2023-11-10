import { forwardRef, MouseEventHandler, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { warningToastConfig } from 'config/toastConfig';
import { toast } from 'react-toastify';

import CalendarSvg from 'components/UI/Inputs/InputDate/icons/Calendar.svg';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';
import scss from './PickDate.module.scss';
import { getMonth, getYear, setDate, setMonth, setYear } from 'date-fns';

interface PickDateProps {
    start: Date;
    end: Date;
    setStart: (o: Date) => void;
    setEnd: (o: Date) => void;
    showWeek?: boolean;
    selectMonth?: boolean;
}

export const RangeDatePicker = ({
    end,
    start,
    setStart,
    setEnd,
    showWeek,
    selectMonth = false,
}: PickDateProps) => {
    const query = useSearchParams();

    const [startDate, setStartDate] = useState<Date>(start);
    const [endDate, setEndDate] = useState<Date>(end);

    const startQuery = query.get('start');
    const endQuery = query.get('end');

    const onChange = (dates: Date[]) => {
        const [start, end] = dates;
        if (selectMonth) {
            if (getMonth(end) === getMonth(Date.now())) {
                setStartDate(setDate(start, 1));
                setEndDate(new Date());
                return;
            }
            setStartDate(setDate(start, 1));
            setEndDate(end);
            return;
        }

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

        const slicedValue = selectMonth
            ? visibleValue
                  .replace(/\s/g, '')
                  .split('-')
                  .map((el) => el.slice(3))
                  .join(' - ')
            : visibleValue;

        return (
            <div onClick={onClick} className={scss.custom_input} ref={ref}>
                <CalendarSvg className={scss.custom_input_svg} />
                <button style={{ cursor: 'pointer' }}>
                    {visibleValue ? slicedValue : 'Другая дата'}
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
            const difference = selectMonth ? 6 : showWeek ? 2 : 1;
            const newEnd = new Date();

            const newStart = selectMonth
                ? setDate(setMonth(Date.now(), getMonth(Date.now()) - 6), 1)
                : setMonth(Date.now(), getMonth(Date.now()) - difference);

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
                maxDate={new Date()}
                disabledKeyboardNavigation
                clearButtonClassName={scss.clear_button}
                selected={null}
                showMonthYearPicker={selectMonth}
                startDate={startDate}
                endDate={endDate}
                portalId="root"
                showWeekNumbers={showWeek}
                selectsRange
            />
        </div>
    );
};
