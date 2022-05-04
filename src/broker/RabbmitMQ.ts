import client, {Channel, Connection, ConsumeMessage} from 'amqplib'
import config from "../config";
import Broker from "./Broker";

class RabbitMQ extends Broker {
    connection: Connection | undefined
    channel: Channel | undefined
    userExchange: string = "user-exchange"
    userQueue: string = "user-queue";

    messageExchange: string = "message-exchange"
    messageQueue: string = "message-queue";

    connect = async () => {
        const url = config.get("BROKER_URL")
        const username = config.get("BROKER_USERNAME")
        const password = config.get("BROKER_PASSWORD")
        const port = config.get("BROKER_PORT")
        
        try {
            this.connection = await client.connect(`amqp://${username}:${password}@${url}:${port}`)
        } catch(error) {
            console.error(error)
            process.exit(1)
        }

        this.connection.on('error', (err) => {
            console.error(err)
            process.exit(1)
        })

        this.channel = await this.connection.createChannel()

        this.userQueue += "-" + (new Date().getTime()).toString()
        this.messageQueue += "-" + (new Date().getTime()).toString()

        this.channel.assertExchange(this.userExchange, "fanout")
        this.channel.assertQueue(this.userQueue, {
            autoDelete: true
        })
        this.channel.bindQueue(this.userQueue, this.userExchange, "")

        this.channel.assertExchange(this.messageExchange, "fanout")
        this.channel.assertQueue(this.messageQueue, {
            autoDelete: true
        })
        this.channel.bindQueue(this.messageQueue, this.messageExchange, "")
    }

    sendMessage(queue: string, message: Buffer): void {
        this.channel?.publish(queue, "", message)
    }

    consumeMessage(queue: string, callback: any): void {
        const consumer = (channel: Channel, callback: any) => (msg: ConsumeMessage | null): void => {
            if (msg) {
                callback(msg.content.toString())
                channel.ack(msg)
            }
        }

        this.channel?.consume(queue, consumer(this.channel, callback))
    }
    
}

export default RabbitMQ