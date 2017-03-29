import pathParse from 'path-parse';
import { flatMap, groupBy } from 'lodash';

export default function (assets) {
    const finalAssets = flatMap(assets, (files, chunk) => files.map(asset => ({ asset, chunk })));

    return groupBy(finalAssets, (file) => {
        const meta = pathParse(file.asset);

        return meta.ext.replace(/^\./, '');
    });
}
