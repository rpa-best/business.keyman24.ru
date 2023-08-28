import ArrowSvg from '/public/svg/arrow.svg';
import { List } from 'components/PickList/List';

import { IAdminPermission, IGroupPermission, IPermission } from 'http/types';
import { addSelected } from 'components/PickList/helpers/checkForInclusion';
import scss from './PickList.module.scss';
import { CustomGroupAdminPermission } from 'app/(Main)/org-settings/components/PickListPermissionGroup/types';
import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';
import { useEffect, useState } from 'react';

export interface DefaultElem {
    id: string;
    content?: string | null;
    name?: string | null;
    customDesc?: string | null;
}

interface PickListProps {
    title: string;
    available?: DefaultElem[];
    selected?: DefaultElem[];
    handleArrowLeft: (arr: DefaultElem[]) => void;
    handleArrowRight: (arr: DefaultElem[]) => void;
    selectedClicked: DefaultElem[];
    availableClicked: DefaultElem[];
    loading: boolean;
}

export const PickList = ({
    available,
    handleArrowRight,
    handleArrowLeft,
    title,
    selected,
    selectedClicked,
    availableClicked,
    loading,
}: PickListProps) => {
    const [source, setSource] = useState<DefaultElem[]>();
    const [target, setTarget] = useState<DefaultElem[]>();

    const [sourceSelected, setSourceSelected] = useState<DefaultElem[]>();
    const [targetSelected, setTargetSelected] = useState<DefaultElem[]>();

    useEffect(() => {
        setSource(available);
        setTarget(selected);
        setSourceSelected(availableClicked);
        setTargetSelected(selectedClicked);
    }, [available, availableClicked, selected, selectedClicked]);

    function handleClick(
        elem: DefaultElem,
        arr: DefaultElem[],
        set: (arr: DefaultElem[]) => void
    ) {
        const data = addSelected(arr, elem);
        set(data);
    }

    return (
        <>
            <h3 className={scss.picklist_title}>{title}</h3>
            <div className={scss.picklist_wrapper}>
                <div className={scss.list_view_wrapper}>
                    <span className={scss.header_wrapper}>Доступ запрещен</span>
                    <div className={scss.list_view_content}>
                        <List
                            selected={sourceSelected}
                            items={source}
                            handleItemClick={(elem) =>
                                handleClick(
                                    elem,
                                    sourceSelected as DefaultElem[],
                                    setSourceSelected
                                )
                            }
                        />
                    </div>
                </div>
                <ul className={scss.actions_separator_wrapper}>
                    <li
                        style={loading ? { pointerEvents: 'none' } : undefined}
                        className={scss.arrow}
                        onClick={() => {
                            if (sourceSelected?.length === 0) {
                                return;
                            }
                            handleArrowRight(sourceSelected as DefaultElem[]);
                        }}
                    >
                        <ArrowSvg className={scss.arrow_right} />
                    </li>
                    <li
                        style={loading ? { pointerEvents: 'none' } : undefined}
                        className={scss.arrow}
                        onClick={() => {
                            if (targetSelected?.length === 0) {
                                return;
                            }
                            handleArrowLeft(targetSelected as DefaultElem[]);
                        }}
                    >
                        <ArrowSvg className={scss.arrow_left} />
                    </li>
                </ul>
                <div className={scss.list_view_wrapper}>
                    <span className={scss.header_wrapper}>Доступ разрешен</span>
                    <div className={scss.list_view_content}>
                        <List
                            selected={targetSelected}
                            items={target as DefaultElem[]}
                            handleItemClick={(elem) =>
                                handleClick(
                                    elem,
                                    targetSelected as DefaultElem[],
                                    setTargetSelected
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
