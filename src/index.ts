import bodyParser from 'body-parser';
import express, { Express } from 'express';
import config from './config';
import router from './routes';

const app: Express = express();
const port = config.get('port')

app.get('/api', router)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api`)
})