import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { getLocationsOnClient } from 'http/locationsApi';
import { useEffect, useState } from 'react';
import { ILocation } from 'http/types';
import { Spinner } from 'components/Spinner';

import scss from './SelectLocationInput.module.scss';

export const TippyContent = () => {
    const [listValues, setListValues] = useState<ILocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState<ILocation>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            return await getLocationsOnClient();
        };
        fetchData()
            .then((d) => {
                setListValues(d.results);
                setSelectedValue(d.results[0]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return (
        <div className={scss.content_wrapper}>
            <InputSelect
                listValues={listValues}
                name="locations"
                onChange={(v: ILocation) => setSelectedValue(v)}
                value={selectedValue?.name as string}
            />
            {loading && <Spinner />}
        </div>
    );
};
