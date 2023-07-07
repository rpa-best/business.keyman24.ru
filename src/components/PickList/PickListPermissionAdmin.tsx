import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { permissionAdminReducer, permissionReducer } from '../../store'
import '../../assets/styles/scss/pickList.scss'
import { IPermissionAdmin } from '../../models/permission'
import { getModeName, modes } from '../../helpers/modeHelper'
import PickList from './PickList'

interface PickListProps {
    id: number
}

// IPermissionAdmin - selected
// IPermission - available

const PickListPermissionAdmin: FC<PickListProps> = props => {
    const { id } = props
    const dispatch = useAppDispatch()
    const isLoading = {
        available:
            useAppSelector(state => state.permission.isLoading) === 'list',
        selected:
            useAppSelector(state => state.permissionAdmin.isLoading) === 'list',
    }
    const fetchedPerms = useAppSelector(state => state.permission.list)
    const fetchedPermsNested = useAppSelector(
        state => state.permissionAdmin.list,
    )

    useEffect(() => {
        const dispatchedThunk1 = dispatch(permissionReducer.fetch())
        const dispatchedThunk2 = dispatch(
            permissionAdminReducer.fetchWithParams(),
        )

        return () => {
            dispatchedThunk1.abort()
            dispatchedThunk2.abort()
        }
    }, [dispatch, id, permissionReducer, permissionAdminReducer])

    const contains = (arr: IPermissionAdmin[], elem: any) => {
        return (
            arr.filter(i => i.permission.id === elem.id && i.type === elem.type)
                .length === 0
        )
    }

    const selected = fetchedPermsNested.map(perm => {
        return {
            ...perm,
            // content: `${perm.permission.name} ${perm.permission.slug} ${
            //     perm.permission.level
            // } ${getModeName(perm.type)}`,
            name: `${perm?.permission?.name} ( ${perm?.permission?.level?.name} )`,
            customDesc: getModeName(perm?.type),
        }
    })

    const available = fetchedPerms
        .map(perm => {
            return modes.map(mode => {
                return {
                    ...perm,
                    type: mode.mode,
                    // content: `${perm.name} ${perm.slug} ${perm.level} ${mode.name}`,
                    name: `${perm.name} ( ${perm.level.name} )`,
                    customDesc: mode.name,
                }
            })
        })
        .flat()
        .filter(item => contains(selected, item))

    const handleRight = (arr: any) => {
        const data = arr.map((item: any) => {
            return { type: item.type, permission: item.id, org: id }
        })

        if (data.length !== 1) return

        dispatch(permissionAdminReducer.create(data[0])).then(() =>
            dispatch(permissionAdminReducer.fetchWithParams()),
        )
    }

    const handleLeft = (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        dispatch(permissionAdminReducer.delete(data[0])).then(() =>
            dispatch(permissionAdminReducer.fetchWithParams()),
        )
    }

    return (
        <PickList
            title='Настройка прав'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
        />
    )
}

export default PickListPermissionAdmin
