"use strict";

export default function(e) {
    let link = e.currentTarget;

    if (link.tagName.toUpperCase() !== "A") return;

    // Middle click, cmd click, and ctrl click should open
    // links in a new tab as normal.
    if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Ignore cross origin links
    if(location.protocol !== link.protocol || location.hostname !== link.hostname) return;

    e.preventDefault();
}
