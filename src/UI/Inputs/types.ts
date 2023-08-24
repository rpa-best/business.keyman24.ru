import { ChangeEventHandler, CSSProperties, FocusEvent } from 'react';

export interface IInputProps {
    autoFocus?: boolean;
    value: string;
    name: string;
    handleError?: string | undefined | boolean;
    type?: HTMLInputElement['type'];
    size?: 'big' | 'medium';
    onBlur?: (
        event: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>
    ) => void;
    onChange:
        | ChangeEventHandler<HTMLInputElement>
        | ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    style?: CSSProperties;
    autoComplete?: string;
    disabled?: boolean;
    tabIndex?: number;
    needErrorLabel?: boolean;
}
