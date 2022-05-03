import { Server as HttpServer } from 'http';
import Broker from '../broker/Broker';
import RabbitMQ from '../broker/RabbmitMQ';
import IMessageRepository from '../repository/IMessageRepository';
import IUserRepository from '../repository/IUserRepository';
import MessageRepository from '../repository/MessageRepository';
import UserRepository from '../repository/UserRepository';
import ChatSocket from './chatSocket';


const initializeSocket = async (httpServer: HttpServer) => {
    const userRepository: IUserRepository = new UserRepository()
    const messageRepository: IMessageRepository = new MessageRepository()
    const rabbitmq: Broker = new RabbitMQ()

    await rabbitmq.connect()

    const chatSocket: ChatSocket = new ChatSocket(httpServer, userRepository, messageRepository, rabbitmq)

    chatSocket.initialize()
}

export default initializeSocket