import React, { useEffect, useState } from 'react';

import ArrowSvg from '/public/svg/arrow.svg';
import { List } from 'components/PickList/List';
import { addSelected } from 'components/PickList/helpers/checkForInclusion';
import { DefaultElem, PickListProps } from 'components/PickList/types';
import clsx from 'clsx';
import { Spinner } from 'components/Spinner';
import { toast } from 'react-toastify';
import { sortArr, sortByCustomDesc } from 'utils/sortPickListArrays';
import { AxiosError } from 'axios';
import { errorToastOptions, warningToastConfig } from 'config/toastConfig';

import scss from './PickList.module.scss';

export const PickList = ({
    available,
    handleArrowRight,
    handleArrowLeft,
    title,
    selected,
    visible = true,
    hidden = false,
    rightTitle = 'Доступ разрёшен',
    leftTitle = 'Доступ запрещён',
    setLoading,
    loading,
    setRefresh,
    sortByCustom,
}: PickListProps) => {
    const [visibility, setVisibility] = useState(visible);

    const [source, setSource] = useState<DefaultElem[]>();
    const [target, setTarget] = useState<DefaultElem[]>();

    const [sourceSelected, setSourceSelected] = useState<DefaultElem[]>([]);
    const [targetSelected, setTargetSelected] = useState<DefaultElem[]>([]);

    useEffect(() => {
        if (sortByCustom) {
            setSource(sortByCustomDesc(available));
        } else {
            setSource(sortArr(available));
        }
    }, [available]);

    useEffect(() => {
        if (sortByCustom) {
            setTarget(sortByCustomDesc(selected));
        } else {
            setTarget(sortArr(selected));
        }
    }, [selected]);

    function handleClick(
        elem: DefaultElem,
        arr: DefaultElem[],
        set: (arr: DefaultElem[]) => void,
        event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) {
        const data = addSelected(arr, elem);
        set(data);
    }

    const handleArrRight = async () => {
        if (sourceSelected?.length === 0) {
            return;
        }
        setLoading(true);
        handleArrowRight(sourceSelected as DefaultElem[])
            .then((d) => {
                const newTarget = sourceSelected.map((src, index) => {
                    return { ...src, id: d[index].id };
                });

                setTarget((t) => [...(t as []), ...newTarget]);
                setSource((s) => {
                    return s?.filter((elem) => {
                        return !sourceSelected.some(
                            (search) => search?.uuid === elem?.uuid
                        );
                    });
                });
                setSourceSelected([]);
            })
            .catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status !== 403) {
                        toast(
                            'Ошибка, попробуйте обновить страницу',
                            errorToastOptions
                        );
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleArrLeft = () => {
        if (targetSelected?.length === 0) {
            return;
        }
        setLoading(true);
        handleArrowLeft(targetSelected as DefaultElem[])
            .then(() => {
                setTarget((s) => {
                    return s?.filter((elem) => {
                        return !targetSelected.some(
                            (search) => search.id === elem.id
                        );
                    });
                });
                setTargetSelected([]);
                setRefresh((v) => !v);
            })
            .catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status != 403) {
                        toast(
                            'Ошибка, попробуйте обновить страницу',
                            errorToastOptions
                        );
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const arrowClass = clsx({
        [scss.picklist_header_svg]: true,
        [scss.picklist_header_svg_active]: hidden && !visibility,
    });

    const pickListClass = clsx({
        [scss.picklist_wrapper]: visibility,
        [scss.picklist_wrapper_hidden]: hidden && !visibility,
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
                <List
                    selected={sourceSelected}
                    items={source}
                    title={leftTitle}
                    handleItemClick={(elem, event) => {
                        handleClick(
                            elem,
                            sourceSelected as DefaultElem[],
                            setSourceSelected,
                            event
                        );
                    }}
                />
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
                <List
                    title={rightTitle}
                    selected={targetSelected}
                    items={target as DefaultElem[]}
                    handleItemClick={(elem, event) => {
                        handleClick(
                            elem,
                            targetSelected as DefaultElem[],
                            setTargetSelected,
                            event
                        );
                    }}
                />
            </div>
            {loading && <Spinner />}
        </>
    );
};
