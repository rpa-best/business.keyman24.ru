import React from 'react';
import scss from 'components/Table/Table.module.scss';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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
    const searchParams = useSearchParams();

    if (dots) {
        return <span className={scss.paginator_item_dots}>. . .</span>;
    }

    const urlSearchParams = new URLSearchParams(
        Array.from(searchParams.entries())
    );
    urlSearchParams.set('offset', `${(pageNumber - 1) * offset}`);

    return (
        <Link
            href={`${path}/?${urlSearchParams}`}
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
