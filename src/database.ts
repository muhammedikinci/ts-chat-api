import mongoose from 'mongoose';
import config from './config';

export default async () => {
    const username = config.get("database_username")
    const password = config.get("database_password")
    const url = config.get("database_url") + '/' + config.get("database_name")

    try {
        await mongoose.connect(`mongodb://${username}:${password}@${url}`)
    } catch(error) {
        console.error(error)
        process.exit(1)
    }
}