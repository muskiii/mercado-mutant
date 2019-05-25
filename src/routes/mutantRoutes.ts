import { Router } from 'express';
import { check } from 'express-validator/check';
import { analyze } from '../controllers/mutantController';

class MutantRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/mutant/', check('dna').custom(this.validateDna), analyze);
    }

    validateDna(dna: any) {
        if (Array.isArray(dna)) {
            dna.forEach(sequence => {
                if (typeof sequence !== "string")
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

const mutantRouter = new MutantRouter();
export default mutantRouter.router;
