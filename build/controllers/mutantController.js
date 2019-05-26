"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const sentinel_1 = require("../search/sentinel");
const Human_1 = __importDefault(require("../models/Human"));
const crypto_js_1 = __importDefault(require("crypto-js"));
class MutantController {
    constructor(redisService) {
        this.analyze = (req, res) => {
            const errors = check_1.validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
            }
            let { dna } = req.body;
            const result = sentinel_1.isMutant(dna);
            let hash = crypto_js_1.default.SHA256(dna.join("")).toString();
            this.redisService.getHuman(hash).then((human) => {
                //REDIS Human
                if (human && typeof JSON.parse(human) != 'undefined') {
                    let isMutant = JSON.parse(human).isMutant;
                    if (isMutant) {
                        console.log("found a Mutant in Redis");
                        return res.status(200).send();
                    }
                    else {
                        console.log("Found a Human in Redis");
                        return res.status(302).send();
                    }
                }
                else {
                    Human_1.default.findOne({ hash })
                        .then((human) => {
                        //DB Human
                        if (human) {
                            if (human.isMutant) {
                                console.log("Found a mutant in DB");
                                return res.status(200).send();
                            }
                            else {
                                console.log("Found a Human in DB");
                                return res.status(302).send();
                            }
                        }
                        else {
                            //NEW Human
                            let human = new Human_1.default();
                            human.sequense = dna;
                            human.hash = hash;
                            human.isMutant = result;
                            human.save();
                            this.redisService.storeHuman(human.hash, human.isMutant);
                            this.redisService.updateStats(human.isMutant);
                            if (result) {
                                console.log("found a Mutant");
                                return res.status(200).send();
                            }
                            else {
                                console.log("Found a Human");
                                return res.status(302).send();
                            }
                        }
                    })
                        .catch((err) => {
                        res.sendStatus(500).send(err);
                    });
                }
            });
        };
        this.redisService = redisService;
    }
}
exports.default = MutantController;
