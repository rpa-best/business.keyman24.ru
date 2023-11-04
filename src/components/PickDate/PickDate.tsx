import {
    forwardRef,
    MouseEventHandler,
    useEffect,
    useRef,
    useState,
} from 'react';

import CalendarSvg from 'components/UI/Inputs/InputDate/icons/Calendar.svg';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';
import scss from 'components/PickDate/PickDate.module.scss';
import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';

interface PickDateProps {
    start: Date;
    end: Date;
    setStart: (o: Date) => void;
    setEnd: (o: Date) => void;
}

export const PickDate = ({ end, start, setStart, setEnd }: PickDateProps) => {
    const [startDate, setStartDate] = useState<Date>(start);
    const [endDate, setEndDate] = useState<Date>(end);

    const onChange = (dates: Date[]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        setStartDate(start);
    }, [start]);

    useEffect(() => {
        setEndDate(end);
    }, [end]);

    useEffect(() => {
        if (!startDate && !endDate) {
            const start = new Date();
            const end = new Date(
                new Date().setMonth(new Date().getMonth() + 1)
            );
            setStartDate(start);
            setEndDate(end);
            setStart(start);
            setEnd(end);
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
        return (
            <div onClick={onClick} className={scss.custom_input} ref={ref}>
                <CalendarSvg className={scss.custom_input_svg} />
                <button style={{ cursor: 'pointer' }}>
                    {visibleValue ? visibleValue : 'Другая дата'}
                </button>
            </div>
        );
    });

    return (
        <div className={scss.date_picker_wrapper}>
            <DatePicker
                locale={ru}
                calendarClassName={scss.another_date}
                isClearable={true}
                dateFormat="dd/MM/yyyy"
                onChange={(e) => {
                    setStart(e[0] as Date);
                    setEnd(e[1] as Date);
                    onChange(e as Date[]);
                }}
                popperClassName={scss.popper_class}
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                customInput={<CustomInput />}
                onCalendarClose={() => {
                    if (startDate && !endDate) {
                        toast('Конечная дата не выбрана', warningToastConfig);
                    }
                }}
                startDate={startDate}
                endDate={endDate}
                portalId="root"
                selectsRange
            />
        </div>
    );
};
