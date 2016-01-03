"use strict";

const IP_CLASS = "not-empty";

export default function(input) {
    if (input.value.length > 0 || input.validity.badInput === true) {
        input.classList.add(IP_CLASS);
    } else {
        input.classList.remove(IP_CLASS);
    }
}
