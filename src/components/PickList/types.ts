export interface DefaultElem {
    id: string;
    content?: string | null;
    name?: string | null;
    customDesc?: string | null;
}

export interface PickListProps {
    title: string;
    hidden?: boolean;
    available: DefaultElem[];
    selected: DefaultElem[];
    handleArrowLeft: (arr: DefaultElem[]) => Promise<void>;
    handleArrowRight: (arr: DefaultElem[]) => Promise<void>;
    loading: boolean;
}

export interface ListProps {
    selected?: DefaultElem[];
    items?: DefaultElem[];
    handleItemClick: (elem: DefaultElem) => void;
}
