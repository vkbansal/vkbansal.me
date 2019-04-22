declare namespace JSX {
    type A = keyof HTMLElementTagNameMap;
    interface IntrinsicElements extends Record<A, any> {}
}
