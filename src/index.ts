import express, { Express } from 'express';
import config from './config';
import router from './routes';

const app: Express = express();
const port = config.get('port')

app.get('/api', router)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api`)
})