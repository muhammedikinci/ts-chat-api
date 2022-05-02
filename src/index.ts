import bodyParser from 'body-parser';
import express, { Express } from 'express';
import config from './config';
import connectDatabase from './database';
import router from './routes';
import http from 'http'
import cors from 'cors';
import initializeSocket from './socket';

connectDatabase();

const app: Express = express();
const port = config.get('port')

app.use(cors({
    origin: '*'
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)

const server = http.createServer(app)

initializeSocket(server)

server.listen(port, () => {
    console.log(`
    ##############################################
    Server running at 
                http://localhost:${port}/api
                ws://localhost:${port}
    ##############################################
    `)
})