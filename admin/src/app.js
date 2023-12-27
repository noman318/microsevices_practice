"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var app = express();
var PORT = 8000;
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:4200",
    ],
}));
app.listen(PORT, function () {
    console.log("Listening to PORT ".concat(PORT));
});
