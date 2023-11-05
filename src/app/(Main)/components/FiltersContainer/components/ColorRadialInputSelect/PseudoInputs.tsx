'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import ArrowSvg from '/public/svg/arrow.svg';
import clsx from 'clsx';
import { PseudoInput } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect/PseudoInput';

import scss from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect/ColorRadialInput.module.scss';
import { useResizeWidth } from 'hooks/useResizeWidth';

interface PseudoInputsProps {
    handleChangeType: () => void;
    selectedValues?: any[];
    inputValue: string;
    bgColor: string;
    handleDeleteOne: (v: number) => void;
}

export const PseudoInputs: React.FC<PseudoInputsProps> = ({
    inputValue,
    selectedValues,
    handleDeleteOne,
    bgColor,
    handleChangeType,
}) => {
    const { tabletBreak, thousandTwoBreak } = useResizeWidth();

    const itemCount = useMemo(() => {
        return selectedValues ? selectedValues?.length : 1;
    }, [selectedValues]);

    const limited = itemCount <= 2 && !thousandTwoBreak && !tabletBreak;

    return (
        <div
            style={{ maxHeight: limited ? '45px' : undefined }}
            className={scss.pseudo_inputs_container}
        >
            <div
                onClick={() => {
                    handleChangeType();
                }}
                className={scss.pseudo_inputs}
            >
                {!selectedValues && inputValue && (
                    <PseudoInput
                        itemCount={itemCount}
                        bgColor={bgColor}
                        name={inputValue}
                        handleDeleteOne={() => handleDeleteOne(0)}
                    />
                )}
                {selectedValues?.map((el, index) => (
                    <PseudoInput
                        itemCount={itemCount}
                        key={index}
                        bgColor={bgColor}
                        name={el.name}
                        handleDeleteOne={() => handleDeleteOne(el.id)}
                    />
                ))}
            </div>
        </div>
    );
};
