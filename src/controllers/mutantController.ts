import { Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import testGrups from '../utils/testGroup';
import { isMutant } from "../utils/sentinel";
import Human from '../models/Human';
import Crypto from 'crypto-js';
import redis from 'redis';
import { json } from 'body-parser';


class MutantController {
    client: redis.RedisClient;

    constructor(client: redis.RedisClient) {
        this.client = client;
    }

    analyze = (req: Request, res: Response): void => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }

        let { dna } = req.body;
        const result = isMutant(dna, testGrups, 2);
        let hash = Crypto.SHA256(dna.join("")).toString();
        this.client.get(hash, (err, human) => {
            //REDIS Human
            if (human && typeof JSON.parse(human) != 'undefined') {
                let isMutant = JSON.parse(human).isMutant;
                
                if (isMutant) {
                    console.log("found a Mutant in Redis")
                    return res.status(200).send();
                } else {
                    console.log("Found a Human in Redis")
                    return res.status(302).send();
                }
            } else {
                Human.findOne({ hash })
                    .then((human: any) => {
                        //DB Human
                        if (human) {
                            if (human.isMutant) {
                                console.log("Found a mutant in DB")
                                return res.status(200).send();
                            } else {
                                console.log("Found a Human in DB")
                                return res.status(302).send();
                            }
                        } else {
                            //NEW Human
                            let human = new Human();
                            human.sequense = dna;
                            human.hash = hash;
                            human.isMutant = result;
                            human.save();
                            this.client.set(hash, JSON.stringify({ isMutant: result }))
                            this.client.get("mutantStats", (err, stats) => {
                                if (stats) {
                                    let jsonStats = JSON.parse(stats);
                                    if (human.isMutant){
                                        jsonStats.count_mutant_dna++;
                                    }else{
                                        jsonStats.count_human_dna++;
                                    }
                                    if (jsonStats.count_human_dna > 0){
                                        jsonStats.ratio = parseFloat((jsonStats.count_mutant_dna / jsonStats.count_human_dna).toFixed(1));
                                    }else{
                                        jsonStats.ratio = jsonStats.count_mutant_dna;
                                    }
                                    this.client.set("mutantStats", JSON.stringify(jsonStats))
                                } else {
                                    console.log("Stats were not Initialized");
                                }
                    
                            });
                            if (result) {                                
                                console.log("found a Mutant");                               
                                return res.status(200).send();
                            } else {
                                console.log("Found a Human");
                                return res.status(302).send();
                            }
                        }
                    })
                    .catch((err: any) => {
                        res.sendStatus(500).send(err)
                    });
            }
        });
    }
}

export default MutantController;
