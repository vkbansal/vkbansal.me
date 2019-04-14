export type SingleOrArray<T> = T | T[];

export async function render(component: any): Promise<string> {
    return await component;
}

export async function html(
    tag: keyof HTMLElementTagNameMap | ((props: Record<string, any>) => Promise<string>),
    props: Record<string, any>,
    ...children: Array<SingleOrArray<string> | SingleOrArray<Promise<string>>>
): Promise<string> {
    if (typeof tag === 'string') {
        if (tag === 'br') {
            return '<br>';
        }

        let attrs = '';
        const childrenPromises = children.reduce(
            (p, c) => {
                Array.isArray(c) ? p.push(...c) : p.push(c);
                return p;
            },
            [] as Array<string | Promise<string>>
        );
        const child = await Promise.all(childrenPromises);

        for (let prop in props) {
            attrs += ` ${prop}="${props[prop]}"`;
        }

        return `<${tag}${attrs}>${child.join('')}</${tag}>`;
    }

    const result = await tag({ ...props, children });

    return result;
}
