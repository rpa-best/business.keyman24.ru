'use client';

import { OrgPickListWrapper } from 'app/(Main)/locations/components/OrgPickListWrapper';
import { WorkersPickListWrapper } from 'app/(Main)/locations/components/WorkersPickListWrapper';
import React, { useState } from 'react';
import { IOrganization } from 'store/types';

export const PickListsWrapper = ({
    organizations,
}: {
    organizations: IOrganization[];
}) => {
    const [listsRefresh, setListsRefresh] = useState(false);
    return (
        <>
            <OrgPickListWrapper
                setListsRefresh={setListsRefresh}
                organizations={organizations}
            />
            <WorkersPickListWrapper listsRefresh={listsRefresh} />
        </>
    );
};
