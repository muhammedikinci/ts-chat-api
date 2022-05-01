import dotenv from 'dotenv';

dotenv.config();

interface Config {
    get(config: string): any
}

const environment: { [key: string]: any } = {
    ...process.env,
}

const config: Config = {
    get: (config: string): string => {
        return environment[config.toUpperCase()] || '';
    }
}

export default config