import { IInputProps } from '../types';

export interface InputDateProps
    extends Pick<IInputProps, 'name' | 'autoFocus' | 'type'> {
    value: Date;
    onBlur?: <T>(e: T) => void;
    onChange: (value: Date) => void;
    alwaysShowMask?: boolean;
    mask: string;
    placeholder: string;
    label?: string;
    disabled?: boolean;
    handleError?: string | undefined;
}
