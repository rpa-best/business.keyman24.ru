import React, { Dispatch, SetStateAction } from 'react';

export interface DefaultElem {
    id: string;
    content?: string | null;
    name?: string | null;
    uuid: string;
    customDesc?: string | null;
}

export interface PickListProps {
    title: string;
    hidden?: boolean;
    visible?: boolean;
    leftTitle?: string;
    rightTitle?: string;
    available: DefaultElem[];
    selected: DefaultElem[];
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setRefresh: Dispatch<SetStateAction<boolean>>;
    handleArrowLeft: (arr: DefaultElem[]) => Promise<void>;
    handleArrowRight: (arr: DefaultElem[]) => Promise<DefaultElem[]>;
    sortByCustom?: boolean;
}

export interface ListProps {
    title: string;
    selected?: DefaultElem[];
    items?: DefaultElem[];
    handleItemClick: (
        elem: DefaultElem,
        event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => void;
}
