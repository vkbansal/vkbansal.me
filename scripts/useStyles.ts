import { processCSS } from './utils/processCSS';
import { stringHash } from './utils/miscUtils';

/**
 * This function must be used as the first
 */
export async function useStyles(css: string): Promise<Record<string, string>> {
    if (!module.parent) {
        throw new Error('useStyles should not be invoked directly!');
    }

    const hash = stringHash(css, 'md5', 'hex');

    if (useStyles.stylesMap.has(hash)) {
        const data = useStyles.stylesMap.get(hash);

        return data!.exports;
    }

    const data = await processCSS(css);
    useStyles.stylesMap.set(hash, data!);

    return data!.exports;
}

useStyles.stylesMap = new Map<string, { css: string; exports: Record<string, string> }>();
