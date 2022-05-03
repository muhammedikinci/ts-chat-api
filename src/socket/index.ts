import { Server as HttpServer } from 'http';
import Broker from '../broker/Broker';
import RabbitMQ from '../broker/RabbmitMQ';
import IUserRepository from '../repository/IUserRepository';
import UserRepository from '../repository/UserRepository';
import ChatSocket from './chatSocket';


const initializeSocket = async (httpServer: HttpServer) => {
    const repo: IUserRepository = new UserRepository()
    const rabbitmq: Broker = new RabbitMQ()

    await rabbitmq.connect()

    const chatSocket: ChatSocket = new ChatSocket(httpServer, repo, rabbitmq)

    chatSocket.initialize()
}

export default initializeSocket