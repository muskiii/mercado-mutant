"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = __importDefault(require("redis"));
const mutantRoutes_1 = __importDefault(require("./routes/mutantRoutes"));
const stasRoutes_1 = __importDefault(require("./routes/stasRoutes"));
const redis_2 = __importDefault(require("./services/redis"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
    }
    config() {
        var os = require('os');
        console.log("Number of processors => ", os.cpus().length);
        const REDIS_URL = "redis://h:p9049179e6eefb134b2515deb5e195971be781e6b4336ba04323d320d6dd803a4@ec2-3-218-28-187.compute-1.amazonaws.com:16259";
        const MONGO_URI = 'mongodb://localhost/mercado-mutant';
        mongoose_1.default.set('useFindAndModify', false);
        mongoose_1.default.set('debug', true);
        mongoose_1.default.connect(process.env.MONGODB_URI || MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true
        }).then(db => {
            console.log("DB is connected");
            const client = redis_1.default.createClient(process.env.REDIS_URL || REDIS_URL);
            client.on("connect", () => {
                console.log("REDIS is connected");
                client.flushall(() => console.log("REDIS FLUSHALL"));
                this.routes(client);
            });
        });
        // Settings
        this.app.set('port', process.env.PORT || 5000);
        // middlewares
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(helmet_1.default());
        this.app.use(compression_1.default());
        this.app.use(cors_1.default());
    }
    routes(client) {
        let redisService = new redis_2.default(client);
        this.app.use('/', new mutantRoutes_1.default(redisService).router);
        this.app.use('/', new stasRoutes_1.default(redisService).router);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server is listenning on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
