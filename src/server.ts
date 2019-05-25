import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import mutantRoutes from './routes/mutantRoutes';
import statsRoutes from './routes/statsRoutes';

// process.env.MONGODB_URL = "mongodb://admin:4dm1npa55@ds143156.mlab.com:43156/mercado-mutant"

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        const MONGO_URI = 'mongodb://localhost/mercado-mutant';
        mongoose.set('useFindAndModify', false);
        mongoose.connect(MONGO_URI || process.env.MONGODB_URL, {
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

    public routes(): void {
        this.app.use('/', mutantRoutes);
        this.app.use('/', statsRoutes);
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server is listenning on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();