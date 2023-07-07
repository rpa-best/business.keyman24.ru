import React, { FC, useEffect, useState } from 'react'
import '../../assets/styles/scss/sidebar.scss'
import { LayoutGroup } from 'framer-motion'
import { ReactComponent as SVGDropdownArrow } from '../../assets/img/shared/arrows/arrow-left.svg'
import getSidebarData from '../../helpers/getSidebarData'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import useLocalStorage from '../../hooks/useLocalStorage'
import nullToEmptyString from '../../helpers/nullToEmptyString'
import isNullOrEmptyString from '../../helpers/isNullOrEmptyString'
import getEntity from '../../helpers/fixMe'
import Spinner from '../Spinner/Spinner'
import InlineSpinner from '../Spinner/InlineSpinner'
import { deviceReducer } from '../../store'
import SidebarLink, { SidebarLinkProps } from './SidebarLink'

const Sidebar: FC = () => {
    const dispatch = useAppDispatch()
    const { id } = useAppSelector(state => state.org.currentOrg)
    const [sidebarIsActive, setSidebarIsActive] = useLocalStorage<string>(
        'sidebarActive',
        nullToEmptyString(localStorage.getItem('sidebarActive')),
    )
    const [showLinks, setShowLinks] = useState<SidebarLinkProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const validateLinks = async () => {
        if (id === undefined) return

        const links = getSidebarData(id)
        const reducers = links.map(link => {
            return {
                endpoint: link.endpoint,
                reducer: getEntity(link.endpoint).reducer,
            }
        })
        const validLinks = await Promise.all(
            reducers.map(async reducer => {
                try {
                    const result = await dispatch(
                        reducer.reducer.head(),
                    ).unwrap()
                    return (
                        result &&
                        links.find(link => link.endpoint === reducer.endpoint)
                    )
                } catch {
                    return undefined
                }
            }),
        )

        const emptyCheck = validLinks.filter(item => item !== undefined)

        setShowLinks(emptyCheck)
        setIsLoading(false)

        // return validLinks
    }

    useEffect(() => {
        if (isNullOrEmptyString(localStorage.getItem('sidebarActive'))) {
            setSidebarIsActive(
                nullToEmptyString(localStorage.getItem('sidebarActive')),
            )
        }
        // validateLinks()
        // const dispatchedThunk = dispatch(deviceReducer.head())

        // return () => {
        //     // eslint-disable-next-line no-unused-expressions
        //     dispatchedThunk && dispatchedThunk.abort()
        // }
        // .then(data => console.log(data))
    }, [])

    return (
        <div className='sidebar-wrapper d-flex'>
            <nav className={`sidebar d-flex flex-column ${sidebarIsActive}`}>
                <div className='toggle-wrapper d-flex'>
                    <button
                        type='button'
                        className='toggle'
                        onClick={() =>
                            setSidebarIsActive(prev =>
                                prev === '' ? 'close' : '',
                            )
                        }
                    >
                        <SVGDropdownArrow stroke='var(--text-color-my)' />
                    </button>
                </div>

                <div className='menu-bar d-flex h-100 flex-column justify-content-between'>
                    <div className='menu'>
                        <ul className='nav-links'>
                            {/* {isLoading && <InlineSpinner textColor='#fff' />}
                            {!isLoading && (
                                <LayoutGroup>
                                    {id
                                        && showLinks.map(item => {
                                            return (
                                                <SidebarLink
                                                    key={item.title}
                                                    {...item}
                                                />
                                            )
                                        })}
                                </LayoutGroup>
                            )} */}
                            <LayoutGroup>
                                {id &&
                                    getSidebarData(id).map(item => {
                                        return (
                                            <SidebarLink
                                                key={item.title}
                                                {...item}
                                            />
                                        )
                                    })}
                            </LayoutGroup>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar
