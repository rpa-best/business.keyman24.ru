'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { createLocationWorker, deleteLocationWorker } from 'http/locationsApi';
import { PickList } from 'components/PickList';
import { Spinner } from 'components/Spinner';
import { WorkersPickListWrapperProps } from 'app/(Main)/locations/types';
import { DefaultElem } from 'components/PickList/types';

export const WorkersPickListWrapper: React.FC<WorkersPickListWrapperProps> = ({
    target,
    source,
}) => {
    const [loading, setLoading] = useState(false);

    const params = useParams();

    const router = useRouter();

    const handleArrowRight = async (elems: DefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createLocationWorker({
                    location: +params.id,
                    worker: +el.id,
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
                await deleteLocationWorker(+params.id, +el.id);
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
                handleArrowLeft={handleArrowLeft}
                handleArrowRight={handleArrowRight}
                available={source as []}
                selected={target as []}
                title="Настройки работников"
            />
            {loading && <Spinner />}
        </>
    );
};
