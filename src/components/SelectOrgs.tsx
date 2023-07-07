import React, { FC, useEffect, useState } from 'react'
import nullToEmptyString from '../helpers/nullToEmptyString'
import getOptionsByArray, {
    type SelectOptions,
} from '../helpers/getOptionsByArray'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { selectStyles, themeUnset } from '../config/selectStyles'
import Select from 'react-select/async'
import { workerReducer } from '../store'
import { useFetchWorkerNestedElementQuery } from '../store/api/workerNestedElementApi'
import { useFetchOrgNestedOrgQuery } from '../store/api/orgNestedOrgApi'

interface SelectOrgsProps {
    currOrg: number
    handleOrg: (org: number) => void
}

const SelectOrgs: FC<SelectOrgsProps> = props => {
    const globalOrg = useAppSelector(state => state.org.currentOrg)
    const { currOrg, handleOrg } = props
    const {
        data: fetchedOrgs = [],
        isLoading: orgsLoading,
        isFetching: orgsFetching,
    } = useFetchOrgNestedOrgQuery({
        orgId: globalOrg.id || 0,
    })
    const isOrgLoading = orgsLoading || orgsFetching
    const opts = getOptionsByArray(fetchedOrgs, 'id', 'name')

    const rawOrgs = opts.find(option => option.value === currOrg)
    const temp = rawOrgs || ({} as any)

    const filterOptions = (inputValue: string): SelectOptions[] => {
        return fetchedOrgs.map(item => {
            return {
                value: item.id,
                label: item.name,
            }
        })
    }

    const loadOrgs = (
        inputValue: string,
        callback: (options: SelectOptions[]) => void,
    ) => {
        setTimeout(() => {
            if (inputValue) {
                // dispatch(fetchByNameOrg(inputValue))
                callback(filterOptions(inputValue))
            }
        }, 500)
    }

    // if (isOrgLoading) return <> </>

    return (
        <div className='select-wrapper'>
            <Select
                placeholder='выберите организацию'
                noOptionsMessage={() => 'name not found'}
                onChange={e => {
                    handleOrg(e.value)
                }}
                styles={selectStyles}
                loadOptions={loadOrgs}
                isLoading={isOrgLoading}
                defaultOptions={opts}
                value={rawOrgs === undefined ? null : temp}
                theme={(defTheme: any) => themeUnset(defTheme)}
                className='header-select'
            />
        </div>
    )
}

export default SelectOrgs
