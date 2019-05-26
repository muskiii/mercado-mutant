import { Router } from 'express';
import StatsController from '../controllers/statsController';
import redis from "redis";

class StatsRouter {
    statsController : StatsController;
    router: Router;

    constructor(client: redis.RedisClient) {
        this.statsController = new StatsController(client)
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/stats', this.statsController.getStats);
    }
}

export default StatsRouter;
