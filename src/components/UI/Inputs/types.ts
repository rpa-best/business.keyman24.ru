import { ChangeEventHandler, CSSProperties, FocusEvent } from 'react';
import { MotionValue } from 'framer-motion';

export interface IInputProps {
    autoFocus?: boolean;
    value: string;
    name: string;
    handleError?: string | undefined | boolean;
    type?: HTMLInputElement['type'];
    size?: 'big' | 'medium';
    errorFontColor?: string;
    onBlur?: (
        event: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>
    ) => void;
    onChange:
        | ChangeEventHandler<HTMLInputElement>
        | ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    style?: CSSProperties;
    autoComplete?: 'on' | 'off';
    disabled?: boolean;
    tabIndex?: number;
    label?: string;
    needErrorLabel?: boolean;
}

export interface ListProps {
    list: { id: number; name: string }[];
    handleSetData: (id: number, name: string) => void;
    opacity: MotionValue<string>;
}

export interface IInputSelectProps extends Omit<IInputProps, 'onChange'> {
    listValues: { id: number; name: string }[];
    onChange: (item: any) => void;
    setFieldTouched?: (field: string, value: boolean) => void;
}
