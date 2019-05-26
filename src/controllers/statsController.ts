import { Request, Response } from 'express';
import RedisService from '../services/redis'
import Human from '../models/Human'

class StatsController {
    redisService: RedisService;

    constructor(redisService: RedisService) {
        this.redisService = redisService;
        this.initStats();
    }

    getStats = (req: Request, res: Response): void => {
        this.redisService.getStats().then((stats) => {
            if (stats) {
                console.log("Found Stats in Redis");
                res.json(JSON.parse(stats));
            } else {
                console.log("Stats were not Initialized");
            }
        })
    }
    initStats = () => {
        this.redisService.getStats().then((stats) => {
            if (stats) {
                console.log("Found Stats in Redis");
            } else {
                Human.find({}, (err: any, humans: any) => {
                    let count_human_dna: number = 0;
                    let count_mutant_dna: number = 0;
                    let ratio: number = 0;
                    if (!err) {
                        if (humans.length > 1) {
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
                            console.log("Stats init from DB");
                            this.redisService.storeStats({ count_mutant_dna, count_human_dna, ratio })
                        } else {
                            console.log("Stats loaded with empty data");
                            this.redisService.storeStats({ count_mutant_dna, count_human_dna, ratio })
                        }

                    } else {
                        console.log("Error retriving humans");
                        console.log("Stats loaded with empty data");
                        this.redisService.storeStats({ count_mutant_dna, count_human_dna, ratio })
                    }
                });
            }

        });
    }
}
export default StatsController;
