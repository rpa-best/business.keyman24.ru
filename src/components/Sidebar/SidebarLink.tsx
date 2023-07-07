import React, { FC, SVGProps, useEffect } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useReduxHooks'
import getEntity from '../../helpers/fixMe'
import SpinnerSidebar from '../Spinner/SpinnerSidebar'
import SidebarLinkWithChildren from './SidebarLinkWithChildren'
import SidebarLinkActive from './SidebarLinkActive'
import SidebarLinkNonActive from './SidebarLinkNonActive'

export interface SidebarLinkProps {
    title: string
    Icon: FC<SVGProps<SVGSVGElement>>
    link: string
    children: {
        title: string
        link: string
    }[]
    endpoint: string
}

const SidebarLink: FC<SidebarLinkProps> = props => {
    const dispatch = useAppDispatch()
    const {
        title, Icon, link, children, endpoint,
    } = props
    const match = useMatch({
        path: link,
        end: link.length === 1,
    })

    const { reducer, callSelector } = getEntity(endpoint)
    const { head } = callSelector()

    useEffect(() => {
        const dispatchedThunk = dispatch(reducer.head())

        return () => {
            // eslint-disable-next-line no-unused-expressions
            dispatchedThunk && dispatchedThunk.abort()
        }
    }, [])

    if (callSelector().isLoading === 'head') {
        return <SpinnerSidebar />
    }

    if (!head) {
        return null
    }

    return children.length === 0 ? (
        <li>
            <Link to={link}>
                {match ? (
                    <SidebarLinkActive title={title} Icon={Icon} />
                ) : (
                    <SidebarLinkNonActive title={title} Icon={Icon} />
                )}
            </Link>
            {/* <ul className='sub-menu blank'>
            <li>
                <a className='link_name' href='#'>
                    {title}
                </a>
            </li>
        </ul> */}
        </li>
    ) : (
        <SidebarLinkWithChildren {...props} />
    )
}

export default SidebarLink
