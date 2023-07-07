import React, {ChangeEvent, FocusEvent} from 'react'

interface Props {
    name: string
    label: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: FocusEvent<HTMLInputElement>) => void
    value: string
}

const FormInputRow: React.FC<Props> = ({
    name,
    label,
    onChange,
    onBlur,
    value,
}) => {
    return (
        <div className='input-row-wrapper flex-column'>
            <h3 className='input-label'>{label}</h3>
            <input
                name={name}
                className='custom-input'
                onChange={onChange}
                onBlur={onBlur}
                value={value}
            />
        </div>
    )
}

export default FormInputRow
