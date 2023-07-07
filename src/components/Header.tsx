import React, { FC } from 'react'

interface HeaderProps {
    title: string
    // eslint-disable-next-line react/require-default-props
    className?: string | null | undefined
}

const Header: FC<HeaderProps> = props => {
    const { title, className } = props

    return <h1 className={`custom-header ${className}`}>{title}</h1>
}

export default Header
