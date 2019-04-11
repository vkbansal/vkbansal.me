import { useStyles } from '../../scripts/useStyles';

export async function render(tags: string[]) {
    const styles = await useStyles(tagStyles);

    return /* html */ `
    <div class="${styles['tags']}">
        ${tags
            .map(
                tag => /* html */ `
            <a class="${styles['tag-link']}" href="/blog/label/${tag}">${tag}</a>
        `
            )
            .join('\n')}
    </div>
    `;
}

const tagStyles = /* css */ `
@import "variables.scss";

.tags {
    display: flex;

    & .tag-link {
        display: inline-flex;
        color: darken($color-grey, 30%);
        font-size: 0.8rem;
        margin-right: 8px;
        padding: 5px 10px;
        background: lighten($color-grey, 30%);
        text-decoration: none;
    }
}
`;
