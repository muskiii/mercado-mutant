import redis from 'redis';
const {promisify} = require('util');

export interface Stats {
    count_mutant_dna: number;
    count_human_dna: number;
    ratio: number;
}

class RedisService {
    client: redis.RedisClient;

    constructor(client: redis.RedisClient) {
        this.client = client;
    }

    getHuman = async (hash : string)  => {
        const getAsync = promisify(this.client.get).bind(this.client);
        return getAsync(hash);
    }

    storeHuman = (hash : string, isMutant: boolean) => {
        this.client.set(hash, JSON.stringify({ isMutant }))
    }

    getStats = async () =>{
        const getAsync = promisify(this.client.get).bind(this.client);
        return getAsync("mutantStats");
    }

    storeStats = async(stas:Stats) => {
        this.client.set("mutantStats", JSON.stringify(stas))
    }
    
    updateStats = (isMutant: boolean) => {

        this.client.get("mutantStats", (err, stats) => {
            if (stats) {
                let jsonStats = JSON.parse(stats);
                if (isMutant) {
                    jsonStats.count_mutant_dna++;
                } else {
                    jsonStats.count_human_dna++;
                }
                if (jsonStats.count_human_dna > 0) {
                    jsonStats.ratio = parseFloat((jsonStats.count_mutant_dna / jsonStats.count_human_dna).toFixed(1));
                } else {
                    jsonStats.ratio = jsonStats.count_mutant_dna;
                }
                this.client.set("mutantStats", JSON.stringify(jsonStats))
                console.log("Stats were updated");
            } else {
                console.log("Stats were not Initialized");
            }
        });
    };
}
export default RedisService;