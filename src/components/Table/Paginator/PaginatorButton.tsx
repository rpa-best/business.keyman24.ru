import React from 'react';
import scss from 'components/Table/Table.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PaginatorButtonProps {
    children?: number;
    currentPage: number;
    pageNumber: number;
    dots?: boolean;
    offset: number;
    handlePaginatorClick: (page: number) => void;
}

export const PaginatorButton: React.FC<PaginatorButtonProps> = ({
    handlePaginatorClick,
    pageNumber,
    currentPage,
    children,
    offset,
    dots = false,
}) => {
    const path = usePathname();

    if (dots) {
        return <span className={scss.paginator_item_dots}>. . .</span>;
    }
    return (
        <Link
            href={`${path}/?offset=${(pageNumber - 1) * offset}`}
            className={
                currentPage === pageNumber
                    ? scss.paginator_item_active
                    : scss.paginator_item
            }
            onClick={() => handlePaginatorClick(pageNumber)}
        >
            {children}
        </Link>
    );
};
