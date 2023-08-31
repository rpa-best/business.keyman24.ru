'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { OrgPickListProps } from 'app/(Main)/locations/edit/[id]/types';
import { PickList } from 'components/PickList';
import { Spinner } from 'components/Spinner';
import {
    createLocationOrganization,
    deleteLocationOrganization,
} from 'http/locationsApi';
import { DefaultElem } from 'components/PickList/types';

export const OrgPickListWrapper: React.FC<OrgPickListProps> = ({
    source,
    target,
}) => {
    const [loading, setLoading] = useState(false);

    const params = useParams();

    const router = useRouter();

    const handleArrowRight = async (elems: DefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createLocationOrganization({
                    to_org: +el.id,
                    location: +params.id,
                });
            })
        ).finally(() => {
            router.refresh();
            setLoading(false);
        });
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await deleteLocationOrganization(+params.id, +el.id);
            })
        ).finally(() => {
            router.refresh();
            setLoading(false);
        });
    };

    return (
        <>
            <PickList
                hidden
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
                available={source as []}
                selected={target as []}
                title="Настройки организации"
            />
            {loading && <Spinner />}
        </>
    );
};
