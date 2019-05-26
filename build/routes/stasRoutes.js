"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = __importDefault(require("../controllers/statsController"));
class StatsRouter {
    constructor(redisService) {
        this.statsController = new statsController_1.default(redisService);
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get('/stats', this.statsController.getStats);
    }
}
exports.default = StatsRouter;
