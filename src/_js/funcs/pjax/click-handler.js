"use strict";

import { stripHash } from "./utils";

export default function(e, callback, ...params) {
    let link = e.currentTarget;

    if (link.tagName.toUpperCase() !== "A") return;

    // Middle click, cmd click, and ctrl click should open
    // links in a new tab as normal.
    if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Ignore cross origin links
    if(location.protocol !== link.protocol || location.hostname !== link.hostname) return;

    // Ignore case when a hash is being tacked on the current URL
    if (link.href.indexOf("#") > -1 && stripHash(link) === stripHash(location)) return;

    // Ignore event with default prevented
    if (e.isDefaultPrevented()) return;

    callback(link.getAttribute("href"), ...params);
    e.preventDefault();
}
