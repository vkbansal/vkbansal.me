import { processCSS } from './utils/processCSS';
import { stringHash } from './utils/miscUtils';

/**
 * This function must be used as the first
 */
export async function useStyles(css: string): Promise<Record<string, string>> {
    if (!module.parent) {
        throw new Error('useStyles should not be invoked directly!');
    }

    const data = await processCSS(css);
    const hash = stringHash(css, 'md5');

    if (!useStyles.stylesMap.has(hash)) {
        useStyles.stylesMap.set(hash, data!.css);
    }

    return data!.exports;
}

useStyles.stylesMap = new Map<string, string>();
