"use strict";

import linkClickHandler from "./click-handler";
import { get } from "../../requests";


export function loadPage(data) {
    document.title = data.title;
    document.body.className = data.body_class;
    document.getElementById("site-content").innerHTML = data.content;
}

export function fetchPage(link) {
    let path = link.replace(/\/$/g, "") + "/index.json";
    get(path, (data) => {
        loadPage(data);
    });
}

export function clickHandler(e) {
    linkClickHandler(e, fetchPage);
};
