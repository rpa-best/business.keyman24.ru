import { useEffect, useState } from 'react';

import ArrowSvg from '/public/svg/arrow.svg';
import { List } from 'components/PickList/List';
import { addSelected } from 'components/PickList/helpers/checkForInclusion';
import { DefaultElem, PickListProps } from 'components/PickList/types';
import clsx from 'clsx';
import { Spinner } from 'components/Spinner';
import { toast } from 'react-toastify';
import { sortArr } from 'helpers/sortPickListArrays';
import { AxiosError } from 'axios';

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
}: PickListProps) => {
    const [visibility, setVisibility] = useState(visible);

    const [source, setSource] = useState<DefaultElem[]>();
    const [target, setTarget] = useState<DefaultElem[]>();

    const [sourceSelected, setSourceSelected] = useState<DefaultElem[]>([]);
    const [targetSelected, setTargetSelected] = useState<DefaultElem[]>([]);

    useEffect(() => {
        setSource(sortArr(available));
    }, [available]);

    useEffect(() => {
        setTarget(sortArr(selected));
    }, [selected]);

    function handleClick(
        elem: DefaultElem,
        arr: DefaultElem[],
        set: (arr: DefaultElem[]) => void
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
                            (search) => search.uuid === elem.uuid
                        );
                    });
                });
                setSourceSelected([]);
            })
            .catch((e) => {
                if (e instanceof AxiosError) {
                    toast('Ошибка, попробуйте обновить страницу', {
                        position: 'bottom-right',
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                        theme: 'colored',
                    });
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
                    toast('Ошибка, попробуйте обновить страницу', {
                        position: 'bottom-right',
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                        theme: 'colored',
                    });
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
                <div className={scss.list_view_wrapper}>
                    <span className={scss.header_wrapper}>{leftTitle}</span>
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
                    <span className={scss.header_wrapper}>{rightTitle}</span>
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
