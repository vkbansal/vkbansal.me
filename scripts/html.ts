export type SingleOrArray<T> = T | T[];

export async function render(component: any): Promise<string> {
    return await component;
}

function flattenDeep<T>(arr: any[]): T[] {
    const ret = [...arr];

    for (let i = 0; i < ret.length; i++) {
        if (Array.isArray(ret[i])) {
            ret.splice(i, 1, ...ret[i--]);
        }
    }

    return ret;
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
        const childrenPromises: Array<string | Promise<string>> = flattenDeep(children);
        const child = await Promise.all(childrenPromises);

        for (let prop in props) {
            if (typeof props[prop] !== 'undefined') {
                attrs += ` ${prop}="${props[prop]}"`;
            }
        }

        return `<${tag}${attrs}>${child.join('')}</${tag}>`;
    }

    const result = await tag({ ...props, children });

    return result;
}
