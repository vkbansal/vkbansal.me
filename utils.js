export function getBlogUrls (blogSettings) {
    return {
        index: `/${blogSettings.prefix}/`,
        paginationUrl: `/${blogSettings.prefix}/${blogSettings.paginationSuffix}`,
        labelUrl: `/${blogSettings.prefix}/${blogSettings.labelSuffix}`,
        labelPaginationUrl: `/${blogSettings.prefix}/${blogSettings.labelSuffix}/${blogSettings.paginationSuffix}`
    };
}
