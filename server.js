"use strict";

let Express = require("express"),
    path = require("path"),
    config = require("./scripts/config"),
    opener = require("opener");

let app = new Express(),
    root = path.resolve(__dirname, config.location.destination);

app.use(Express.static(root));

app.listen(config.server.port, config.server.host, function (err) {
    if (err) {
        console.log(err);
    }

    let url = `${config.server.protocol}://${config.server.host}:${config.server.port}`;

    console.log(`Serving ${root}`);
    console.log(`Server started at ${url}`);
    opener(url);
});
