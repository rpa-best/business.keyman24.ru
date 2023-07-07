import React, { FC, SVGProps } from 'react'

interface SidebarLinkNonActiveProps {
    title: string
    Icon: FC<SVGProps<SVGSVGElement>>
}

const SidebarLinkNonActive: FC<SidebarLinkNonActiveProps> = props => {
    const { title, Icon } = props

    return (
        <>
            <span className='marker-link' />
            <span className='icon'>
                <Icon fill='#A1A1A1' />
            </span>
            <span className='link_name text-color-inactive'>{title}</span>
        </>
    )
}

export default SidebarLinkNonActive
