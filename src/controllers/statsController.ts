import { Request, Response, Router } from 'express';

export function getStats(req: Request, res: Response): void {
    res.json({ count_mutant_dna: 40, count_human_dna: 100, ratio: 0.4 });
}

