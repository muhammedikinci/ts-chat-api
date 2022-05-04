import sinon from "sinon";
import { Server } from "socket.io";
import ChatSocket from '../../socket/chatSocket';
import mockUserRepository from "./mocks/mockUserRepository";
import mockBroker from "./mocks/mockBroker";
import { expect } from "chai";
import mockMessageRepository from "./mocks/mockMessageRepository";
import { io as Client, Socket } from 'socket.io-client';
import jwt from "jsonwebtoken";
import config from "../../config";
import { ActiveUsers, MessageSender } from "../../dto/sockets";
import { createServer } from "http";
import IUser from "../../model/IUser";
import IMessage from "../../model/IMessage";

describe('ChatSocket Test', () => {
    const sinonConfigMock = sinon.mock(config)

    sinonConfigMock.expects("get").atLeast(1).returns("test")

    const sandbox = sinon.createSandbox()

    const sinonUserRepo = sandbox.mock(mockUserRepository)
    const sinonMessageRepo = sandbox.mock(mockMessageRepository)
    const sinonBroker = sandbox.mock(mockBroker)

    let socketPort = 0;

    const httpServer = createServer();
    const io = new Server(httpServer);
    
    httpServer.listen(() => {
        const address: any = httpServer.address()
        socketPort = address.port
        
    })
  
    const chatSocket = new ChatSocket(io, mockUserRepository, mockMessageRepository, mockBroker)

    afterEach(() => {
        sandbox.restore()
    })

    it('getAllUsers and broker consume must work when chatSocket initializing and activeUser count must be 1', () => {
        sinonUserRepo.expects("getAllUsers").once().returns(Promise.resolve([{}]))
        sinonBroker.expects("consumeMessage").exactly(2)
        
        return chatSocket.initialize().then(() => {
            sinonUserRepo.verify()
            sinonBroker.verify()

            expect(chatSocket.activeUsers.length == 1).to.be.ok

            sinonUserRepo.restore()
            sinonBroker.restore()
        })
    })

    const token = jwt.sign({ username: "muhammed" }, config.get("private_key"));
    let socket: Socket

    async function connectClient() {
        socket = Client(`http://localhost:${socketPort}`, {
            query: { token }
        });
        await new Promise((resolve, reject) => {
            const mInternal = setInterval(() => {
                if (socket.connected) {
                    resolve(1)
                    clearInterval(mInternal)
                }
            }, 50)
            setTimeout(() => reject, 1000)
        })
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    it('sendConnectionToQueue must work and trigger the sendMessage and setActive functions', () => {
        sinonUserRepo.expects("setActive")
            .once()
            .withArgs("muhammed", true)
        
        const user: ActiveUsers = {
            username: "muhammed",
            isActive: true
        }
        
        sinonBroker.expects("sendMessage")
            .once()
            .withArgs(mockBroker.userExchange, Buffer.from(JSON.stringify(user)))

        return connectClient().then(() => {
            sinonBroker.verify()
            sinonUserRepo.verify()
        })
    })

    it('when client want to get conversation and if findBySenderAndReceiver return null, empty data must be sent and code must works well', () => {
        sinonMessageRepo.expects("findBySenderAndReceiver").twice().returns(null)
        
        socket.emit("getConversation")
        
        return sleep(500).then(() => {
            sinonMessageRepo.verify()
        })
    })

    it('when client want to get conversation, client event must be triggered', (done) => {
        const findBySenderAndReceiverCallback = sandbox
            .stub(mockMessageRepository, "findBySenderAndReceiver")
            .returns(Promise.resolve(null))
        
        socket.on("getConversation", () => {
            sandbox.assert.calledTwice(findBySenderAndReceiverCallback)
            done()
        })

        socket.emit("getConversation")
    })

    it('when client want to get conversation, client get whole conversation with true data', (done) => {
        const message: IMessage = {
            sender: "muhammed",
            receiver: "muhammed2",
            messages: [{
                content: 'message',
                time: 1
            }]
        }

        const findBySenderAndReceiverCallback = sandbox
            .stub(mockMessageRepository, "findBySenderAndReceiver")
            .onFirstCall()
            .returns(Promise.resolve(message))
            .onSecondCall()
            .returns(Promise.resolve(null))

        socket.on("getConversation", (data) => {
            sandbox.assert.calledTwice(findBySenderAndReceiverCallback)
            expect(data[0].content).to.be.equal(message.messages[0].content)
            expect(data[0].isSender).to.be.equal(true)
            done()
        })

        socket.emit("getConversation")
    })

    it('when client want to send message, repositories and broker implementation works well if conversation does not start before', () => {
        const users: IUser[] = [
            {
                username: "muhammed2",
                password: "",
                isActive: true
            }
        ]

        const messageSender: MessageSender = {
            username: "muhammed",
            message: "message"
        }

        const getAllUsersCallback = sandbox
            .stub(mockUserRepository, "getAllUsers")
            .returns(Promise.resolve(users))
        
        const findBySenderAndReceiverCallback = sandbox
            .stub(mockMessageRepository, "findBySenderAndReceiver")
            .returns(Promise.resolve(null))
        
        const createMessageCallback = sandbox
            .stub(mockMessageRepository, "createMessage")
            .returns(Promise.resolve(null))
        
        const sendMessageCallback = sandbox
            .stub(mockBroker, "sendMessage")
            .withArgs(mockBroker.messageExchange, Buffer.from(JSON.stringify(messageSender)))
            .returns()
        
        socket.emit("sendMessage", messageSender.message)
        return sleep(500).then(() => {
            sandbox.assert.calledOnce(getAllUsersCallback)
            sandbox.assert.calledOnce(findBySenderAndReceiverCallback)
            sandbox.assert.calledOnce(createMessageCallback)
            sandbox.assert.calledOnce(sendMessageCallback)
        })
    })

    it('when client want to send message, repositories and broker implementation works well if conversation does not start before', () => {
        const users: IUser[] = [
            {
                username: "muhammed2",
                password: "",
                isActive: true
            }
        ]

        const getAllUsersCallback = sandbox
            .stub(mockUserRepository, "getAllUsers")
            .returns(Promise.resolve(users))
        
        const findBySenderAndReceiverCallback = sandbox
            .stub(mockMessageRepository, "findBySenderAndReceiver")
            .returns(Promise.resolve(null))
        
        const createMessageCallback = sandbox
            .stub(mockMessageRepository, "createMessage")
            .returns(Promise.resolve(null))
        
        socket.emit("sendMessage", "message")
        
        return sleep(500).then(() => {
            sandbox.assert.calledOnce(getAllUsersCallback)
            sandbox.assert.calledOnce(findBySenderAndReceiverCallback)
            sandbox.assert.calledOnce(createMessageCallback)
        })
    })

    after(() => {
        httpServer.close()
        io.close()
        socket.close()
    })
})