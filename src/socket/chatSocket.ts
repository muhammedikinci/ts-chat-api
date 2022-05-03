import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import IUser from '../model/IUser';
import { authentication } from './middleware';
import IUserRepository from '../repository/IUserRepository';
import { ActiveUsers } from '../dto/sockets';
import Broker from '../broker/Broker';

class ChatSocket {
    httpServer: HttpServer
    repository: IUserRepository
    broker: Broker
    activeUsers: ActiveUsers[]
    io: Server

    constructor(httpServer: HttpServer, repository: IUserRepository, broker: Broker) {
        this.httpServer = httpServer
        this.repository = repository
        this.broker = broker

        this.activeUsers = []
        this.io = new Server(this.httpServer, {
            cors: {
                origin: '*'
            }
        })
    }

    initialize = async () => {
        const allUsers = await this.repository.getAllUsers()

        this.activeUsers = allUsers.map((u: IUser) => { return { username: u.username, isActive: u.isActive } })

        this.io.use(authentication)

        this.startConsumeQueues()

        this.io.on('connection', (socket: Socket) => {
            const username = socket.data.username

            console.log('client connected: ' + username)

            this.sendConnectionToQueue(username)
            this.repository.setActive(username, true)

            socket.on("disconnect", (reason) => {
                this.sendConnectionToQueue(username, false)
                this.repository.setActive(username, false)
                console.log("client disconnected: " + socket.data.username)
            });
        })
    }

    startConsumeQueues = () => {
        this.broker.consumeMessage(this.broker.userQueue, (message: string) => {
            console.log("user update: " + message)
            try {
                const user = JSON.parse(message) as ActiveUsers
                this.updateActiveUserListAndSetActiveState(user.username, user.isActive)
            } catch(e) {}
        })
    }

    sendConnectionToQueue = (username: string, isActive: boolean = true) => {
        const user: ActiveUsers = {
            username, isActive
        }
        this.broker.sendMessage(this.broker.userExchange, Buffer.from(JSON.stringify(user)))
    }

    updateActiveUserListAndSetActiveState = (username: string, isActive: boolean) => {
        const user = this.activeUsers.find((u) => u.username == username)

        if (!user) {
            this.activeUsers.push({
                username: username,
                isActive: isActive
            })
        } else {
            user.isActive = isActive
        }

        this.io.sockets.emit("get_users", this.activeUsers)
    }
}

export default ChatSocket