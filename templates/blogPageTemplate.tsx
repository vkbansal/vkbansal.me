import { RenderArgs } from '../typings/common';
import { html } from '../scripts/html';

export function render(props: RenderArgs) {
    return <section class="container blog-post">{props.content}</section>;
}
