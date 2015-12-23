"use strict";

// Return the `href` component of given URL object with the hash
// portion removed.
//
// location - Location or HTMLAnchorElement
//
// Returns String
export function stripHash(location) {
    return location.href.replace(/#.*/, '')
}
