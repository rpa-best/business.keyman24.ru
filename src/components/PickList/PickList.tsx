import { useEffect, useState } from 'react';

import ArrowSvg from '/public/svg/arrow.svg';
import { List } from 'components/PickList/List';
import { addSelected } from 'components/PickList/helpers/checkForInclusion';
import { DefaultElem, PickListProps } from 'components/PickList/types';

import scss from './PickList.module.scss';
import clsx from 'clsx';
import { Spinner } from 'components/Spinner';

export const PickList = ({
    available,
    handleArrowRight,
    handleArrowLeft,
    title,
    selected,
    hidden = false,
}: PickListProps) => {
    const [visibility, setVisibility] = useState(true);

    const [loading, setLoading] = useState(false);

    const [source, setSource] = useState<DefaultElem[]>();
    const [target, setTarget] = useState<DefaultElem[]>();

    const [sourceSelected, setSourceSelected] = useState<DefaultElem[]>([]);
    const [targetSelected, setTargetSelected] = useState<DefaultElem[]>([]);

    useEffect(() => {
        setSource(available);
        setTarget(selected);
    }, [available, selected]);

    function handleClick(
        elem: DefaultElem,
        arr: DefaultElem[],
        set: (arr: DefaultElem[]) => void
    ) {
        const data = addSelected(arr, elem);
        set(data);
    }

    const handleArrRight = () => {
        if (sourceSelected?.length === 0) {
            return;
        }
        setLoading(true);
        handleArrowRight(sourceSelected as DefaultElem[]).finally(() => {
            setSourceSelected([]);
            setLoading(false);
        });
    };

    const handleArrLeft = () => {
        if (targetSelected?.length === 0) {
            return;
        }
        setLoading(true);
        handleArrowLeft(targetSelected as DefaultElem[]).finally(() => {
            setTargetSelected([]);
            setLoading(false);
        });
    };

    const arrowClass = clsx({
        [scss.picklist_header_svg]: true,
        [scss.picklist_header_svg_active]: !visibility,
    });

    const pickListClass = clsx({
        [scss.picklist_wrapper]: visibility,
        [scss.picklist_wrapper_hidden]: !visibility,
    });

    return (
        <>
            <div className={scss.pick_list_header}>
                <h3 className={scss.picklist_title}>{title}</h3>
                {hidden && (
                    <div
                        onClick={() => setVisibility(!visibility)}
                        className={scss.picklist_header_svg_wrapper}
                    >
                        <ArrowSvg className={arrowClass} />
                    </div>
                )}
            </div>
            <div className={pickListClass}>
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
                        onClick={() => handleArrRight()}
                    >
                        <ArrowSvg className={scss.arrow_right} />
                    </li>
                    <li
                        style={loading ? { pointerEvents: 'none' } : undefined}
                        className={scss.arrow}
                        onClick={() => handleArrLeft()}
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
            {loading && <Spinner />}
        </>
    );
};
