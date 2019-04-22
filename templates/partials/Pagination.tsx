import cx from 'classnames';

import { html } from '../../scripts/html';
import { getPageNumbers } from '../../scripts/utils/miscUtils';
import { useStyles } from '../../scripts/useStyles';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    getUrl: (page: number) => string;
}

export async function Pagination({
    currentPage,
    totalPages,
    getUrl
}: PaginationProps): Promise<string> {
    const pages = getPageNumbers(currentPage, totalPages);
    const styles = await useStyles(paginationStyles);

    return (
        <nav class={styles['pagination']}>
            {currentPage === 1 ? (
                <span class={cx(styles['page-link'], styles['prev-link'], styles['disabled'])}>
                    &larr; Prev
                </span>
            ) : (
                <a
                    class={cx(styles['page-link'], styles['prev-link'])}
                    href={getUrl(currentPage - 1)}
                    rel="prev">
                    &larr; Prev
                </a>
            )}
            <div class={styles['pages']}>
                {pages.map(page => {
                    return typeof page === 'number' ? (
                        currentPage === page ? (
                            <span class={styles['active-link']}>{page}</span>
                        ) : (
                            <a class={styles['page-link']} href={getUrl(page)}>
                                {page}
                            </a>
                        )
                    ) : (
                        <span class={styles['more']}>...</span>
                    );
                })}
            </div>
            {currentPage >= totalPages ? (
                <span class={cx(styles['page-link'], styles['next-link'], styles['disabled'])}>
                    Next &rarr;
                </span>
            ) : (
                <a
                    class={cx(styles['page-link'], styles['next-link'])}
                    href={getUrl(currentPage + 1)}
                    rel="next">
                    Next &rarr;
                </a>
            )}
        </nav>
    );
}

const paginationStyles = /*css*/ `
@import 'variables.scss';

.pagination {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 16px;

    & .pages {
        display: none;

        @media (min-width: $screen-sm) {
            display: flex;
            justify-content: center;
        }

    }

    & .page-link,
    & .active-link,
    & .more  {
        display: inline-flex;
        color: $color-primary;
        border-radius: 2px;
        padding: 8px;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        margin-right: 4px;

        &:last-child {
            margin: 0;
        }
    }

    & .page-link {
        text-decoration: none;
        cursor: pointer;
        border: 1px solid $color-primary;
    }

    & .active-link {
        background: $color-primary;
        color: $color-white;
        border: 1px solid $color-primary;
    }

    & .more {
        color: $color-dark;
    }

    & .prev-link,
    & .next-link {
        width: auto;
        flex-grow: 1;

        @media (min-width: $screen-sm) {
            flex-grow: 0;
        }

    }

    & .prev-link {
        text-align: left;
    }

    & .next-link {
        text-align: right;
    }

    & .disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
`;
