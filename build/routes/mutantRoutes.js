"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_1 = require("express-validator/check");
const mutantController_1 = __importDefault(require("../controllers/mutantController"));
class MutantRouter {
    constructor(redisService) {
        this.mutantController = new mutantController_1.default(redisService);
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.post('/mutant/', check_1.check('dna').custom(this.validateDna), this.mutantController.analyze);
    }
    validateDna(dna) {
        if (Array.isArray(dna)) {
            let length = dna[0].length;
            dna.forEach(sequence => {
                if (typeof sequence !== "string" || sequence.length != length)
                    throw new Error('Invalid Input');
                if (!/^[A|T|C|G]+$/.test(sequence))
                    throw new Error('Invalid caracter in de sequence');
            });
        }
        else {
            throw new Error('Not an Array');
        }
        return true;
    }
}
exports.default = MutantRouter;
