import React, { useMemo } from 'react';

import ExitSvg from '/public/svg/x.svg';

import scss from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect/ColorRadialInput.module.scss';
import { useResizeWidth } from 'hooks/useResizeWidth';

interface PseudoInputProps {
    bgColor: string;
    name: string;
    handleDeleteOne: () => void;
    itemCount: number;
}

export const PseudoInput: React.FC<PseudoInputProps> = ({
    bgColor,
    name,
    handleDeleteOne,
    itemCount,
}) => {
    const { thousandThreeBreak } = useResizeWidth();

    const borderRadius = useMemo(() => {
        if (itemCount === 1) {
            return '25px';
        }
        if (thousandThreeBreak) {
            return '25px';
        }
        if (itemCount > 2 && thousandThreeBreak) {
            return '25px';
        }
    }, [itemCount, thousandThreeBreak]);

    return (
        <div
            style={{
                backgroundColor: bgColor,
                borderRadius: borderRadius,
            }}
            className={scss.pseudo_input}
        >
            {name}
            <ExitSvg
                onClick={(e: any) => {
                    e.stopPropagation();
                    handleDeleteOne();
                }}
                className={scss.svg}
            />
        </div>
    );
};
