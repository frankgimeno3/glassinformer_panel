import {Sequelize} from "sequelize";
import * as fs from "node:fs";
import path from "node:path";
import pg from "pg";

const caPath = path.resolve(process.cwd(), 'certs', 'rds-ca.pem');
let sslCA = null;

// Try to load the certificate file if it exists
try {
    if (fs.existsSync(caPath)) {
        sslCA = fs.readFileSync(caPath, 'utf8');
    }
} catch (error) {
    console.warn(`Certificate file not found at ${caPath}. SSL will be disabled.`);
}

class Database {
    static #instance;
    #sequelize;


    constructor() {
        const dialectOptions = {};
        
        // Only configure SSL if certificate is available
        if (sslCA) {
            dialectOptions.ssl = {
                require: true,
                ca: sslCA.toString(),
                rejectUnauthorized: process.env.NODE_ENV !== 'development',
            };
        }

        this.#sequelize = new Sequelize(
            process.env.DATABASE_NAME,
            process.env.DATABASE_USER,
            process.env.DATABASE_PASSWORD,
            {
                logging: process.env.NODE_ENV === 'development' ? this.log : false,
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                dialect: 'postgres',
                dialectModule: pg,
                dialectOptions
            }
        )
    }

    log(message){
        console.debug(`[Sequelize]: ${message}`)
    }


    static getInstance() {
        if (!this.#instance) {
            this.#instance = new this();
        }
        return this.#instance;
    }

    getSequelize() {
        return this.#sequelize;
    }

    async connect() {
        await this.#sequelize.authenticate();
    }

    async sync() {
        await this.#sequelize.sync({alter: false, force: false})
    }
}

export default Database;