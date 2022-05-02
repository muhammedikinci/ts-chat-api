import { Server as HttpServer } from 'http';
import IBroker from '../broker/IBroker';
import RabbitMQ from '../broker/RabbmitMQ';
import IUserRepository from '../repository/IUserRepository';
import UserRepository from '../repository/UserRepository';
import ChatSocket from './chatSocket';


const initializeSocket = async (httpServer: HttpServer) => {
    const repo: IUserRepository = new UserRepository()
    const rabbitmq: IBroker = new RabbitMQ()

    await rabbitmq.connect("active_users_queue")

    const chatSocket: ChatSocket = new ChatSocket(httpServer, repo, rabbitmq)

    chatSocket.initialize()
}

export default initializeSocket