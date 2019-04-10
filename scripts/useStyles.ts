'use strict';
import callsites from 'callsites';

import { processCSS } from './utils/processCSS';

/**
 * This function must be used as the first
 */
export async function useStyles(css: string): Promise<Record<string, string>> {
    if (!module.parent) {
        throw new Error('useStyles should not be invoked directly!');
    }

    const stack = callsites();
    const filename = stack[stack.length - 1].getFileName() || '';

    const data = await processCSS(css, filename);

    if (!useStyles.stylesMap.has(filename)) {
        useStyles.stylesMap.set(filename, data!.css);
    }

    return data!.exports;
}

useStyles.stylesMap = new Map<string, string>();
