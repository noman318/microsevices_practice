"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var Product_1 = require("./entity/Product");
var ampq = require("amqplib/callback_api");
var PORT = 8000;
(0, typeorm_1.createConnection)()
    .then(function (db) {
    ampq.connect("amqps://jngooawy:ezhlKoISJl4g3KdbBVB48-TT1CS-Y6OY@gull.rmq.cloudamqp.com/jngooawy", function (error, connection) {
        if (error) {
            throw new Error(error);
        }
        connection.createChannel(function (error, channel) {
            if (error) {
                throw new Error(error);
            }
            var app = express();
            app.use(cors({
                origin: [
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:4200",
                ],
            }));
            app.use(express.json());
            var productRepository = db.getRepository(Product_1.Product);
            app.get("/", function (req, res) {
                channel.sendToQueue("hello", Buffer.from("hello"));
                res.status(200).json({ message: "Root Route Working Of MYSQL" });
            });
            app.get("/api/products", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var allProducts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.find()];
                        case 1:
                            allProducts = _a.sent();
                            return [2 /*return*/, res.json(allProducts)];
                    }
                });
            }); });
            app.post("/api/products", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.create(req.body)];
                        case 1:
                            product = _a.sent();
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            result = _a.sent();
                            // console.log("result", result);
                            channel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));
                            return [2 /*return*/, res.json(result)];
                    }
                });
            }); });
            app.get("/api/products/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, productRepository.findOneBy({
                                    id: parseInt(req.params.id, 10),
                                })];
                        case 1:
                            product = _a.sent();
                            if (!product)
                                return [2 /*return*/, res.json({
                                        message: "No Product with given ID found",
                                    })];
                            return [2 /*return*/, res.json(product)];
                        case 2:
                            error_1 = _a.sent();
                            console.log("error", error_1);
                            return [2 /*return*/, error_1.message];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.put("/api/products/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, updatedData, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, productRepository.findOneBy({
                                    id: parseInt(req.params.id, 10),
                                })];
                        case 1:
                            product = _a.sent();
                            if (!product)
                                return [2 /*return*/, res.json({
                                        message: "No Product with given ID found",
                                    })];
                            return [4 /*yield*/, productRepository.merge(product, req.body)];
                        case 2:
                            updatedData = _a.sent();
                            return [4 /*yield*/, productRepository.save(updatedData)];
                        case 3:
                            result = _a.sent();
                            channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)));
                            return [2 /*return*/, res.json(result)];
                        case 4:
                            error_2 = _a.sent();
                            console.log("error", error_2);
                            return [2 /*return*/, error_2.message];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            app.delete("/api/products/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, deletedProduct, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, productRepository.findOneBy({
                                    id: parseInt(req.params.id, 10),
                                })];
                        case 1:
                            product = _a.sent();
                            if (!product)
                                return [2 /*return*/, res.json({
                                        message: "No Product with given ID found",
                                    })];
                            return [4 /*yield*/, productRepository.delete(req.params.id)];
                        case 2:
                            deletedProduct = _a.sent();
                            channel.sendToQueue("product_deleted", Buffer.from(req.params.id));
                            return [2 /*return*/, res.json(deletedProduct)];
                        case 3:
                            error_3 = _a.sent();
                            console.log("error", error_3);
                            return [2 /*return*/, error_3.message];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/products/:id/like", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, productRepository.findOneBy({
                                    id: parseInt(req.params.id, 10),
                                })];
                        case 1:
                            product = _a.sent();
                            if (!product)
                                return [2 /*return*/, res.json({
                                        message: "No Product with given ID found",
                                    })];
                            product.likes++;
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            result = _a.sent();
                            channel.sendToQueue("product_liked", Buffer.from(JSON.stringify(result)));
                            return [2 /*return*/, res.json(result)];
                        case 3:
                            error_4 = _a.sent();
                            console.log("error", error_4);
                            return [2 /*return*/, error_4.message];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.listen(PORT, function () {
                console.log("Listening to PORT of ".concat(PORT));
            });
        });
        process.on("beforeExit", function () {
            console.log("Closing");
            connection.close();
        });
    });
})
    .catch(function (err) { return console.log("ERROR: ", err); });
