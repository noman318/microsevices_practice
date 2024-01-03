"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var typeorm_1 = require("typeorm");
var ormconfig_1 = require("../ormconfig");
var ampq = require("amqplib/callback_api");
// console.log("ormconf", ormConfig);
var cors = require("cors");
var AppDataSource = new typeorm_1.DataSource(__assign({}, ormconfig_1.default));
AppDataSource.initialize()
    .then(function () {
    console.log("DB CONNECTED");
    ampq.connect("amqps://jngooawy:ezhlKoISJl4g3KdbBVB48-TT1CS-Y6OY@gull.rmq.cloudamqp.com/jngooawy", function (error, connection) {
        if (error) {
            throw new Error(error);
        }
        connection.createChannel(function (error, channel) {
            if (error) {
                throw new Error(error);
            }
            var app = express();
            var PORT = 6000;
            channel.assertQueue("product_created", { durable: false });
            channel.assertQueue("product_updated", { durable: false });
            channel.assertQueue("product_deleted", { durable: false });
            channel.assertQueue("product_liked", { durable: false });
            app.use(cors({
                origin: [
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:4200",
                ],
            }));
            app.use(express.json());
            channel.consume("product_created", function (message) {
                var eventProduct = JSON.parse(message.content.toString());
                console.log(message.content.toString(), "message");
            });
            app.listen(PORT, function () {
                console.log("server run on", PORT);
            });
        });
        process.on("beforeExit", function () {
            console.log("Closing");
            connection.close();
        });
    });
})
    .catch(function (err) { return console.log(err); });
