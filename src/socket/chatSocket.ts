import { Server, Socket } from 'socket.io';
import IUser from '../model/IUser';
import { authentication } from './middleware';
import IUserRepository from '../repository/IUserRepository';
import { ActiveUsers, MessageSender } from '../dto/sockets';
import Broker from '../broker/Broker';
import IMessageRepository from '../repository/IMessageRepository';
import PartialMessage from '../model/PartialMessage';

class ChatSocket {
    userRepository: IUserRepository
    messageRepository: IMessageRepository
    broker: Broker
    activeUsers: ActiveUsers[]
    io: Server

    constructor(socketServer: Server, userRepository: IUserRepository, messageRepository: IMessageRepository, broker: Broker) {
        this.io = socketServer
        this.userRepository = userRepository
        this.messageRepository = messageRepository
        this.broker = broker

        this.activeUsers = []
    }

    initialize = async () => {
        const allUsers = await this.userRepository.getAllUsers()

        this.activeUsers = allUsers.map((u: IUser) => { return { username: u.username, isActive: u.isActive } })

        this.io.use(authentication)

        this.startConsumeQueues()

        this.io.on('connection', (socket: Socket) => {
            const username = socket.data.username

            console.log('client connected: ' + username)

            this.sendConnectionToQueue(username)
            this.userRepository.setActive(username, true)

            socket.on("disconnect", (reason) => {
                this.sendConnectionToQueue(username, false)
                this.userRepository.setActive(username, false)
                console.log("client disconnected: " + username)
            });

            socket.on("sendMessage", (message) => {
                this.addMessagesToAllFriends(username, message)
                this.sendMessageToQueue(username, message)
            })

            socket.on("getConversation", (receiver) => {
                this.getConversation(socket, receiver)
            })
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
        this.broker.consumeMessage(this.broker.messageQueue, (message: string) => {
            console.log("message update: " + message)
            try {
                const messageSender = JSON.parse(message) as MessageSender
                this.sendMessageToAllActiveFriends(messageSender)
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

    sendMessageToQueue = (username: string, message: string) => {
        const messageSender: MessageSender = {
            username, message
        }
        this.broker.sendMessage(this.broker.messageExchange, Buffer.from(JSON.stringify(messageSender)))
    }

    addMessagesToAllFriends = async (username: string, message: string) => {
        const users = await this.userRepository.getAllUsers()
        const receivers = users.map(u => u.username).filter(u => u != username)
        const partialMessage: PartialMessage = {
            content: message,
            time: new Date().getTime()
        }

        for (let receiver of receivers) {
            const conversation = await this.messageRepository.findBySenderAndReceiver(username, receiver)

            if (!conversation) {
                await this.messageRepository.createMessage(username, receiver, [partialMessage])
            } else {
                await this.messageRepository.addMessage(username, receiver, partialMessage)

            }
        }
    }

    sendMessageToAllActiveFriends = async (messageSender: MessageSender) => {
        const sockets = await this.io.fetchSockets();
        const trulyActiveUsers = this.activeUsers.filter(u => u.isActive)

        for (let user of trulyActiveUsers) {
            const sck = sockets.find(s => s.data.username == user.username)

            if (sck) {
                sck.emit("getMessage", messageSender)
            }
        }
    }

    getConversation = async (socket: Socket, receiver: string) => {
        const senderMessages = await this.messageRepository.findBySenderAndReceiver(socket.data.username, receiver)
        const receiverMessages = await this.messageRepository.findBySenderAndReceiver(receiver, socket.data.username)

        let messages: any = []

        if (senderMessages) {
            messages = messages.concat(senderMessages.messages.map(message => {
                return {
                    ...message,
                    isSender: true
                }
            }))
        }

        if (receiverMessages) {
            messages = messages.concat(receiverMessages.messages.map(message => {
                return {
                    ...message,
                    isSender: false
                }
            }))
        }

        messages = messages.sort((a: any, b: any) => Number(a.time) - Number(b.time))

        socket.emit("getConversation", messages)
    }
}

export default ChatSocket