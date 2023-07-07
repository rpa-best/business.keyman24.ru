/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, SVGProps, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { ReactComponent as SVGDropdownArrow } from '../../assets/img/topnav/dropdown-arrow.svg'
import SidebarLinkActive from './SidebarLinkActive'
import SidebarLinkNonActive from './SidebarLinkNonActive'

interface SidebarLinkWithChildrenProps {
    title: string
    Icon: FC<SVGProps<SVGSVGElement>>
    link: string
    children: {
        title: string
        link: string
    }[]
}

const SidebarLinkWithChildren: FC<SidebarLinkWithChildrenProps> = props => {
    const {
        title, Icon, link, children,
    } = props

    const linksThatMatch = children.filter(item =>
        useMatch({ path: item.link, end: item.link.length === 1 }),
    )
    const isActive = linksThatMatch.length > 0

    const [showMenu, setShowMenu] = useState(isActive ? 'showMenu' : '')

    const handleShowMenu = () => {
        if (showMenu === '' || null) {
            setShowMenu('showMenu')
        } else {
            setShowMenu('')
        }
    }

    return (
        <li className={showMenu}>
            <div className='iocn-link'>
                <Link to={link}>
                    {isActive ? (
                        <SidebarLinkActive title={title} Icon={Icon} />
                    ) : (
                        <SidebarLinkNonActive title={title} Icon={Icon} />
                    )}
                </Link>
                <SVGDropdownArrow
                    className='arrow'
                    onClick={() => handleShowMenu()}
                />
            </div>

            <span className='marker-link' />
            <ul className='sub-menu'>
                {/* <li>
            <a className='link_name'>{title}</a>
        </li> */}
                {children.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link
                                to={item.link}
                                className={
                                    useMatch({
                                        path: item.link,
                                        end: item.link.length === 1,
                                    })
                                        ? 'text-color-active'
                                        : 'text-color-inactive'
                                }
                            >
                                {item.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </li>
    )
}

export default SidebarLinkWithChildren
