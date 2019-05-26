import { Router } from 'express';
import { check } from 'express-validator/check';
import MutantController from '../controllers/mutantController';
import redis from "redis";

class MutantRouter {
    mutantController : MutantController;
    router: Router;

    constructor(client: redis.RedisClient) {
        this.mutantController = new MutantController(client)
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/mutant/', check('dna').custom(this.validateDna), this.mutantController.analyze);
    }

    validateDna(dna: any) {
        if (Array.isArray(dna)) {
            let length = dna[0].length;
            dna.forEach(sequence => {
                
                if (typeof sequence !== "string" || sequence.length != length)
                    throw new Error('Invalid Input');
                if (!/^[A|T|C|G]+$/.test(sequence))
                    throw new Error('Invalid caracter in de sequence');
            });
        } else {
            throw new Error('Not an Array');
        }
        return true;
    }
}

export default MutantRouter;
