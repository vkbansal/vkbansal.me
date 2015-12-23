"use strict";

import getRecentPosts from "./funcs/get-recent-posts";
import { clickHandler } from "./funcs/pjax";

getRecentPosts();
document.body.addEventListener("click", clickHandler);
