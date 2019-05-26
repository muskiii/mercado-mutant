"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { promisify } = require('util');
class RedisService {
    constructor(client) {
        this.getHuman = (hash) => __awaiter(this, void 0, void 0, function* () {
            const getAsync = promisify(this.client.get).bind(this.client);
            return getAsync(hash);
        });
        this.storeHuman = (hash, isMutant) => {
            this.client.set(hash, JSON.stringify({ isMutant }));
        };
        this.getStats = () => __awaiter(this, void 0, void 0, function* () {
            const getAsync = promisify(this.client.get).bind(this.client);
            return getAsync("mutantStats");
        });
        this.storeStats = (stas) => __awaiter(this, void 0, void 0, function* () {
            this.client.set("mutantStats", JSON.stringify(stas));
        });
        this.updateStats = (isMutant) => {
            this.client.get("mutantStats", (err, stats) => {
                if (stats) {
                    let jsonStats = JSON.parse(stats);
                    if (isMutant) {
                        jsonStats.count_mutant_dna++;
                    }
                    else {
                        jsonStats.count_human_dna++;
                    }
                    if (jsonStats.count_human_dna > 0) {
                        jsonStats.ratio = parseFloat((jsonStats.count_mutant_dna / jsonStats.count_human_dna).toFixed(1));
                    }
                    else {
                        jsonStats.ratio = jsonStats.count_mutant_dna;
                    }
                    this.client.set("mutantStats", JSON.stringify(jsonStats));
                    console.log("Stats were updated");
                }
                else {
                    console.log("Stats were not Initialized");
                }
            });
        };
        this.client = client;
    }
}
exports.default = RedisService;
