import { Router } from 'express';
import { getStats } from '../controllers/statsController';

class StatsRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/stats', getStats);
    }
}

const statsRouter = new StatsRouter();
export default statsRouter.router;
