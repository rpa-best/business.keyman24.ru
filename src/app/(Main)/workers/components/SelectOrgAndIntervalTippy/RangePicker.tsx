import React, {
    forwardRef,
    MouseEventHandler,
    useEffect,
    useState,
} from 'react';
import { getMonth, setDate, setMonth } from 'date-fns';
import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';
import CalendarSvg from 'components/UI/Inputs/InputDate/icons/Calendar.svg';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';
import scss from './SelectOrgAndIntervalTippy.module.scss';
import { formatDate } from 'utils/formatDate';

interface RangePickerProps {
    selectMonth?: boolean;
    setDates: React.Dispatch<
        React.SetStateAction<{ from?: string; to?: string } | null>
    >;
    refresh: boolean;
}

export const RangePicker: React.FC<RangePickerProps> = ({
    selectMonth = false,
    setDates,
    refresh,
}) => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const onChange = (dates: Date[]) => {
        const [start, end] = dates;
        if (selectMonth) {
            if (getMonth(end) === getMonth(Date.now())) {
                setStartDate(start);
                setEndDate(new Date());
                return;
            }
            setStartDate(start);
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

    useEffect(() => {
        setStartDate(undefined);
        setEndDate(undefined);
    }, [refresh]);

    useEffect(() => {
        if (startDate) {
            setDates({ from: formatDate(startDate) });
        } else if (endDate) {
            setDates({ to: formatDate(endDate) });
        }

        if (!endDate && !startDate) {
            setDates(null);
        }
    }, [endDate, startDate]);

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
            <div
                onClick={onClick}
                className={scss.interval_custom_input}
                ref={ref}
            >
                <CalendarSvg className={scss.custom_input_svg} />
                <button style={{ cursor: 'pointer' }}>
                    {visibleValue ? slicedValue : 'Укажите интервал'}
                </button>
            </div>
        );
    });

    return (
        <div className={scss.range_custom_wrapper}>
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
                }}
                maxDate={new Date()}
                placeholderText="Укажите интервал"
                disabledKeyboardNavigation
                clearButtonClassName={scss.clear_button}
                selected={null}
                showMonthYearPicker={selectMonth}
                startDate={startDate}
                endDate={endDate}
                portalId="root"
                selectsRange
            />
        </div>
    );
};
