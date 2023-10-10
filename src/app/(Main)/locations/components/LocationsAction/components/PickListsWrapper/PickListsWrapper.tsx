'use client';

import { OrgPickListWrapper } from 'app/(Main)/locations/components/LocationsAction/components/OrgPickListWrapper';
import { WorkersPickListWrapper } from 'app/(Main)/locations/components/LocationsAction/components/WorkersPickListWrapper';
import React, { useState } from 'react';
import { IOrganization } from 'store/types';

import scss from 'app/(Main)/locations/components/LocationsAction/LocationsAction.module.scss';

interface PickListsWrapperProps {
    organizations: IOrganization[];
    locId: number;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
}

export const PickListsWrapper: React.FC<PickListsWrapperProps> = ({
    organizations,
    locId,
    setLoading,
    loading,
}) => {
    const [listsRefresh, setListsRefresh] = useState(false);
    return (
        <>
            <div className={scss.pick_list_wrapper}>
                <OrgPickListWrapper
                    loading={loading}
                    setLoading={setLoading}
                    locId={locId}
                    setListsRefresh={setListsRefresh}
                    organizations={organizations}
                />
            </div>
            <div className={scss.pick_list_wrapper}>
                <WorkersPickListWrapper
                    loading={loading}
                    setLoading={setLoading}
                    locId={locId}
                    listsRefresh={listsRefresh}
                />
            </div>
        </>
    );
};
