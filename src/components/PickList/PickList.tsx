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

export interface DefaultElem {
    content?: string | null;
    name?: string | null;
    customDesc?: string | null;
}

interface PickListProps {
    title: string;
    available?: CustomPermission[] | IGroupPermission[];
    selected?: IAdminPermission[] | CustomGroupAdminPermission[];
    handleArrowLeft: (arr: any) => void;
    handleArrowRight: (arr: any) => void;
    selectedClicked: CustomAdminPermission[] | CustomGroupAdminPermission[];
    availableClicked: CustomPermission[] | IGroupPermission[];
    loading: boolean;
    setSelectedClicked: (v: any) => void;
    setAvailableClicked: (v: any) => void;
}

export const PickList = ({
    available,
    handleArrowRight,
    handleArrowLeft,
    title,
    selected,
    selectedClicked,
    setAvailableClicked,
    setSelectedClicked,
    availableClicked,
    loading,
}: PickListProps) => {
    function handleClick<T extends { id: number; type: string }>(
        elem: T,
        arr: T[],
        set: (arr: T[]) => void
    ) {
        const data = addSelected<T>(arr, elem);
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
                            selected={availableClicked}
                            items={available as IPermission[]}
                            handleArrClick={(elem) =>
                                handleClick<CustomPermission>(
                                    elem as CustomPermission,
                                    availableClicked as CustomPermission[],
                                    setAvailableClicked
                                )
                            }
                        />
                    </div>
                </div>
                <ul className={scss.actions_separator_wrapper}>
                    <li
                        style={loading ? { pointerEvents: 'none' } : undefined}
                        className={scss.arrow}
                        onClick={() => handleArrowRight(availableClicked)}
                    >
                        <ArrowSvg className={scss.arrow_right} />
                    </li>
                    <li
                        style={loading ? { pointerEvents: 'none' } : undefined}
                        className={scss.arrow}
                        onClick={() => handleArrowLeft(selectedClicked)}
                    >
                        <ArrowSvg className={scss.arrow_left} />
                    </li>
                </ul>
                <div className={scss.list_view_wrapper}>
                    <span className={scss.header_wrapper}>Доступ разрешен</span>
                    <div className={scss.list_view_content}>
                        <List
                            selected={selectedClicked}
                            items={selected as DefaultElem[]}
                            handleArrClick={(elem) =>
                                handleClick<CustomAdminPermission>(
                                    elem as CustomAdminPermission,
                                    selectedClicked as CustomAdminPermission[],
                                    setSelectedClicked
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
