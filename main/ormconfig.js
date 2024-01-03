"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ormConfig = {
    type: "mongodb",
    host: "localhost",
    database: "node_main",
    synchronize: true,
    logging: false,
    entities: ["src/entity/*.js"],
};
exports.default = ormConfig;
