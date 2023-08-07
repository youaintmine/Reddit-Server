"use strict";
exports.__esModule = true;
var path_1 = require("path");
var constant_1 = require("./constant");
var Post_1 = require("./entities/Post");
exports["default"] = {
    migrations: {
        path: path_1["default"].join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}' //All js/ts but not d.js.ts
    },
    entities: [Post_1.Post],
    dbName: 'lireddit',
    type: 'postgresql',
    debug: !constant_1.__prod__,
    user: "postgres",
    password: "insidous"
};
