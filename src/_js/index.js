"use strict";

import getRecentPosts from "./funcs/get-recent-posts";
import updateTextFields from "./funcs/form-inputs";
import { clickHandler } from "./funcs/pjax";

window.vkbansal = {
    getRecentPosts,
    updateTextFields
}

getRecentPosts();
document.body.addEventListener("click", clickHandler);
