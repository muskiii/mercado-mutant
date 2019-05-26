import { Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import { isMutant } from "../search/sentinel";
import Human from '../models/Human';
import Crypto from 'crypto-js';
import RedisService from '../services/redis';

class MutantController {
    redisService: RedisService;

    constructor(redisService: RedisService) {      
        this.redisService = redisService;
    }

    analyze = (req: Request, res: Response): void => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }

        let { dna } = req.body;
        const result = isMutant(dna);
        let hash = Crypto.SHA256(dna.join("")).toString();
        
        this.redisService.getHuman(hash).then((human) => {
            //REDIS Human
            if (human && typeof JSON.parse(human) != 'undefined') {
                let isMutant = JSON.parse(human).isMutant;
                
                if (isMutant) {
                    console.log("found a Mutant in Redis")
                    return res.status(200).send();
                } else {
                    console.log("Found a Human in Redis")
                    return res.status(403).send();
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
                                return res.status(403).send();
                            }
                        } else {
                            //NEW Human
                            let human = new Human();
                            human.sequense = dna;
                            human.hash = hash;
                            human.isMutant = result;
                            human.save();
                            this.redisService.storeHuman(human.hash, human.isMutant);
                            this.redisService.updateStats(human.isMutant);

                            if (result) {                                
                                console.log("found a Mutant");                               
                                return res.status(200).send();
                            } else {
                                console.log("Found a Human");
                                return res.status(403).send();
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
