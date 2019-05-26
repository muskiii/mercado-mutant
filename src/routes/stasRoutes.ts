import { Router } from 'express';
import StatsController from '../controllers/statsController';
import RedisService from '../services/redis'

class StatsRouter {
    statsController : StatsController;
    router: Router;

    constructor(redisService: RedisService) {
        this.statsController = new StatsController(redisService)
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/stats', this.statsController.getStats);
    }
}

export default StatsRouter;
