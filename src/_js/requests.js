"use strict";

export function get(url, callback = () => {}, errback = () => {}) {
    if (window.fetch) {
        window.fetch(url)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                  return response
                } else {
                  var error = new Error(response.statusText)
                  error.response = response
                  throw error
                }
            })
            .then((response) => response.json())
            .then((data) => callback(data))
            .catch(() => errback())
    } else {
        let request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 300) {
                let data = JSON.parse(request.responseText);
                callback(data);
            } else {
                errback();
            }
        }

        request.onerror = function() {
            errback();
        }

        request.send();
    }
}
