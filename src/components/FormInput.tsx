/* eslint-disable react/require-default-props */
import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, HTMLInputTypeAttribute } from 'react'

interface InputProps {
    name: string
    label: string
    error?: string | null | undefined
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    value: string
    type?: HTMLInputTypeAttribute | undefined
    classNameWrapper?: string[]
    classNameInput?: string []
    usePlaceholder?: boolean
    readonly?: boolean
}

const FormInput: FC<InputProps> = props => {
    const {
        name,
        label,
        error,
        onChange,
        onBlur,
        onKeyDown,
        value,
        type = 'text',
        classNameWrapper = [],
        classNameInput = [],
        usePlaceholder,
        readonly,
    } = props
    const checkError = error
        ? 'custom-input custom-input-error'
        : 'custom-input'

    return (
        <div className={'input-wrapper'.concat(' ', ...classNameWrapper)}>
            <div className='input-title'>
                {!usePlaceholder && <h3 className='input-label'>{label}</h3>}
                {error && <h3 className='input-error'>{error}</h3>}
            </div>
            <input
                name={name}
                type={type}
                placeholder={usePlaceholder ? label : undefined}
                className={checkError.concat(' ', ...classNameInput)}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                value={value}
                readOnly={readonly}
            />
        </div>
    )
}

export default FormInput
