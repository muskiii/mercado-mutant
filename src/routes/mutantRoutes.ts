import { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator/check';


class MutantRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    //VALIDAR LO DE ASYN AWAIT
    async getStats(req: Request, res: Response): Promise<void> {
        res.json({ count_mutant_dna: 40, count_human_dna: 100, ratio: 0.4 });
    }

    async analyze(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }
        res.status(302).send();
    }

    routes() {
        this.router.get('/stats', this.getStats);
        this.router.post('/mutant/', check('dna').custom(this.validateDna), this.analyze);
    }

    validateDna(dna: any) {
        if (Array.isArray(dna)) {
            dna.forEach(sequence => {
                console.log(/^[A|T|C|G]+$/.test(sequence));
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
