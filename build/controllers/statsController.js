"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Human_1 = __importDefault(require("../models/Human"));
class StatsController {
    constructor(redisService) {
        this.getStats = (req, res) => {
            this.redisService.getStats().then((stats) => {
                if (stats) {
                    console.log("Found Stats in Redis");
                    res.json(JSON.parse(stats));
                }
                else {
                    console.log("Stats were not Initialized");
                }
            });
        };
        this.initStats = () => {
            this.redisService.getStats().then((stats) => {
                if (stats) {
                    console.log("Found Stats in Redis");
                }
                else {
                    Human_1.default.find({}, (err, humans) => {
                        let count_human_dna = 0;
                        let count_mutant_dna = 0;
                        let ratio = 0;
                        if (!err) {
                            if (humans.length > 1) {
                                humans.forEach((human) => {
                                    if (human.isMutant) {
                                        count_mutant_dna++;
                                    }
                                    else {
                                        count_human_dna++;
                                    }
                                });
                                if (count_human_dna > 0) {
                                    ratio = parseFloat((count_mutant_dna / count_human_dna).toFixed(1));
                                }
                                else {
                                    ratio = count_mutant_dna;
                                }
                                console.log("Stats init from DB");
                                this.redisService.storeStats({ count_mutant_dna, count_human_dna, ratio });
                            }
                            else {
                                console.log("Stats loaded with empty data");
                                this.redisService.storeStats({ count_mutant_dna, count_human_dna, ratio });
                            }
                        }
                        else {
                            console.log("Error retriving humans");
                            console.log("Stats loaded with empty data");
                            this.redisService.storeStats({ count_mutant_dna, count_human_dna, ratio });
                        }
                    });
                }
            });
        };
        this.redisService = redisService;
        this.initStats();
    }
}
exports.default = StatsController;
