import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import IUser from '../model/IUser';
import { authentication } from './middleware';
import IUserRepository from '../repository/IUserRepository';
import IBroker from '../broker/IBroker';

class ChatSocket {
    httpServer: HttpServer
    repository: IUserRepository
    broker: IBroker
    activeUsers: IUser[]

    constructor(httpServer: HttpServer, repository: IUserRepository, broker: IBroker) {
        this.httpServer = httpServer
        this.repository = repository
        this.broker = broker

        this.activeUsers = []
    }

    initialize = () => {
        const io = new Server(this.httpServer, {
            cors: {
                origin: '*'
            }
        })

        io.use(authentication)

        io.on('connection', (socket: Socket) => {
            console.log('client connected: ' + socket.id)

            this.broker.consumeMessage("active_users_queue", (message: string) => {
                console.log("broker message in connection: " + message)
            })
            
            this.broker.sendMessage("active_users_queue", Buffer.from(socket.data.username))

            socket.on("disconnect", (reason) => {
                console.log("client disconnected: " + socket.data.username)
            });
        })
    }

    addToActiveUser = async (socket: Socket) => {
        const username = socket.data.username
        let user = this.activeUsers.find((u) => u.username == username)
    }
}

export default ChatSocket