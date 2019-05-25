import { Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import testGrups from '../utils/testGroup'
import { isMutant } from "../utils/prefix"


export function analyze(req: Request, res: Response): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

    let sequence = { name: "mutant", rows: req.body.dna, words: testGrups, assertions: 2 };
    console.log(sequence)
    const matches = isMutant(sequence.rows, sequence.words, sequence.assertions);
    console.log(matches);
    if (matches) {
        res.status(200).send();
    }
    res.status(302).send();
}
export function getStats(req: Request, res: Response): void {
    res.json({ count_mutant_dna: 40, count_human_dna: 100, ratio: 0.4 });
}

