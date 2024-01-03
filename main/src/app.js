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
var typeorm_1 = require("typeorm");
var ormconfig_1 = require("../ormconfig");
var ampq = require("amqplib/callback_api");
// console.log("ormconf", ormConfig);
var cors = require("cors");
var Product_1 = require("./entity/Product");
var AppDataSource = new typeorm_1.DataSource(__assign({}, ormconfig_1.default));
AppDataSource.initialize()
    .then(function (db) {
    console.log("DB CONNECTED");
    var productRepository = db.getRepository(Product_1.Product);
    // console.log("productRepository", productRepository);
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
            channel.consume("product_created", function (message) { return __awaiter(void 0, void 0, void 0, function () {
                var eventProduct, productData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            eventProduct = JSON.parse(message.content.toString());
                            productData = new Product_1.Product();
                            productData.admin_id = parseInt(eventProduct.id);
                            productData.title = eventProduct.title;
                            productData.image = eventProduct.image;
                            productData.likes = eventProduct.likes;
                            return [4 /*yield*/, productRepository.save(productData)];
                        case 1:
                            _a.sent();
                            console.log("product created");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume("product_updated", function (message) { return __awaiter(void 0, void 0, void 0, function () {
                var eventProduct, product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            eventProduct = JSON.parse(message.content.toString());
                            return [4 /*yield*/, productRepository.findOne({
                                    //@ts-expect-error
                                    admin_id: parseInt(eventProduct.id),
                                })];
                        case 1:
                            product = _a.sent();
                            console.log("product", product);
                            // console.log("eventProduct", eventProduct);
                            productRepository.merge(product, {
                                title: eventProduct.title,
                                image: eventProduct.image,
                                likes: eventProduct.likes,
                            });
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            _a.sent();
                            console.log("product updated");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume("product_deleted", function (message) { return __awaiter(void 0, void 0, void 0, function () {
                var admin_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            admin_id = message.content.toString();
                            // console.log("admin_id", admin_id);
                            // @ts-expect-error
                            return [4 /*yield*/, productRepository.delete({ admin_id: admin_id })];
                        case 1:
                            // console.log("admin_id", admin_id);
                            // @ts-expect-error
                            _a.sent();
                            console.log("product deleted");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume("product_liked", function (message) { return __awaiter(void 0, void 0, void 0, function () {
                var admin_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            admin_id = message.content.toString();
                            // console.log("admin_id", admin_id);
                            // @ts-expect-error
                            return [4 /*yield*/, productRepository.delete({ admin_id: admin_id })];
                        case 1:
                            // console.log("admin_id", admin_id);
                            // @ts-expect-error
                            _a.sent();
                            console.log("product deleted");
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            app.get("/api/products", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var products;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.find()];
                        case 1:
                            products = _a.sent();
                            return [2 /*return*/, res.send(products)];
                    }
                });
            }); });
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
