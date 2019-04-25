import cx from 'classnames';

import { html } from '../../scripts/html';
import { useStyles } from '../../scripts/useStyles';

export interface TagsProps {
    tags: string[];
    cutsomClass?: string;
}

export async function Tags(props: TagsProps) {
    const styles = await useStyles(tagStyles);
    const { tags, cutsomClass } = props;
    return (
        <div class={cx(styles['tags'], cutsomClass)}>
            <span class={styles['title']}>Labels</span>
            {tags.map(tag => (
                <a class={styles['tag-link']} href={`/blog/label/${tag}`}>
                    {tag}
                </a>
            ))}
        </div>
    );
}

const tagStyles = /* css */ `
@import "variables.scss";

.tags {
    & .title {
        font-weight: bold;

        &::after {
            content: ":";
            margin-right: 4px;
        }
    }

    & .tag-link:not(:last-child)::after {
        content: ",";
        color: $color-dark;
        margin-right: 4px;
    }
}
`;
