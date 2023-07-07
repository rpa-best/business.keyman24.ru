import { motion } from 'framer-motion'
import React, { FC, SVGProps } from 'react'

interface SidebarLinkActiveProps {
    title: string
    Icon: FC<SVGProps<SVGSVGElement>>
}

const SidebarLinkActive: FC<SidebarLinkActiveProps> = props => {
    const { title, Icon } = props

    return (
        <>
            <motion.span layoutId='activeItem' className='marker-link active' />
            <span className='icon'>
                <Icon fill='#31D79B' />
            </span>
            <span className='link_name text-color-active'>{title}</span>
        </>
    )
}

export default SidebarLinkActive
