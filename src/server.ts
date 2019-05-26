import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import redis from "redis";

import MutantRoutes from './routes/mutantRoutes';
import StatsRouter from './routes/statsRoutes';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    public config(): void {
        const REDIS_URL = "redis://h:p9049179e6eefb134b2515deb5e195971be781e6b4336ba04323d320d6dd803a4@ec2-3-218-28-187.compute-1.amazonaws.com:16259";
        const client: redis.RedisClient = redis.createClient( process.env.REDIS_URL || REDIS_URL);

        client.on("connect", () => {
            console.log("REDIS is connected");
            this.routes(client);
        });

        const MONGO_URI = 'mongodb://localhost/mercado-mutant';
        mongoose.set('useFindAndModify', false);
        mongoose.set('debug', true);
        mongoose.connect(process.env.MONGODB_URL || MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true            
        }).then(db => console.log("DB is connected"));

        // Settings
        this.app.set('port', process.env.PORT || 5000);

        // middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    public routes(client: redis.RedisClient): void {
        this.app.use('/', new MutantRoutes(client).router);
        this.app.use('/', new StatsRouter(client).router);
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server is listenning on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();