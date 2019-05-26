import { Request, Response } from 'express';
import redis from "redis";
import Human from '../models/Human'

class StatsController {
    client: redis.RedisClient;

    constructor(client: redis.RedisClient) {
        this.client = client;
        this.initStats();
    }

    getStats = (req: Request, res: Response): void => {
        this.client.get("mutantStats", (err, stats) => {
            if (stats) {
                console.log("Found Stats in Redis");
                res.json(JSON.parse(stats));
            } else {
                console.log("Stats were not Initialized");
            }

        });
    }
    initStats = () => {
        this.client.get("mutantStats", (err, stats) => {
            if (stats) {
                console.log("Found Stats in Redis");
            } else {
                Human.find({}, (err: any, humans: any) => {
                    if (!err) {
                        if (humans.length > 1) {
                            let count_human_dna: number = 0;
                            let count_mutant_dna: number = 0;
                            let ratio: number;
                            humans.forEach((human: any) => {
                                if (human.isMutant) {
                                    count_mutant_dna++;
                                } else {
                                    count_human_dna++;
                                }
                            });
                            if (count_human_dna > 0) {
                                ratio = parseFloat((count_mutant_dna / count_human_dna).toFixed(1));
                            } else {
                                ratio = count_mutant_dna;
                            }
                            let newStats = { count_mutant_dna, count_human_dna, ratio };
                            console.log("Stats init in REDIS");
                            this.client.set("mutantStats", JSON.stringify(newStats))
                        } else {
                            console.log("Stats loaded with empty data");
                            this.client.set("mutantStats", JSON.stringify({ count_mutant_dna: 0, count_human_dna: 0, ratio: 0 }))
                        }

                    } else {
                        console.log("Error retriving humans");
                        console.log("Stats loaded with empty data");
                        this.client.set("mutantStats", JSON.stringify({ count_mutant_dna: 0, count_human_dna: 0, ratio: 0 }))
                    }
                });
            }

        });
    }
}
export default StatsController;
