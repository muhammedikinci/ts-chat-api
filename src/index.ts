import bodyParser from 'body-parser';
import express, { Express } from 'express';
import config from './config';
import connectDatabase from './database';
import router from './routes';

connectDatabase();

const app: Express = express();
const port = config.get('port')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api`)
})