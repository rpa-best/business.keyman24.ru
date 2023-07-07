import React, { FC, ChangeEvent, FocusEvent } from 'react'

interface CheckBoxSwitchProps {
    name: string
    label: string
    value: boolean
    onBlur: (e: FocusEvent<HTMLInputElement>) => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    checked: boolean
}

const CheckBoxSwitch: FC<CheckBoxSwitchProps> = props => {
    const {
        name, label, value, onBlur, onChange, checked,
    } = props

    return (
        <div className='input-checkbox-wrapper form-switch'>
            <h3 className='checkbox-label'>{label}</h3>
            <input
                name={name}
                className='form-check-input'
                onBlur={onBlur}
                type='checkbox'
                value={value.toString()}
                checked={checked}
                onChange={onChange}
            />
        </div>
    )
}

export default CheckBoxSwitch
