import IBroker from "./IBroker";
import client, {Channel, Connection, ConsumeMessage} from 'amqplib'
import config from "../config";

class RabbitMQ implements IBroker {
    connection: Connection | undefined
    channel: Channel | undefined

    connect = async (queue: string) => {
        const url = config.get("BROKER_URL")
        const username = config.get("BROKER_USERNAME")
        const password = config.get("BROKER_PASSWORD")
        const port = config.get("BROKER_PORT")
        
        this.connection = await client.connect(`amqp://${username}:${password}@${url}:${port}`)
    
        this.channel = await this.connection.createChannel()

        await this.channel.assertQueue(queue)
    }

    sendMessage(queue: string, message: Buffer): void {
        this.channel?.sendToQueue(queue, message)
    }

    consumeMessage(queue: string, callback: any): void {
        const consumer = (channel: Channel, callback: any) => (msg: ConsumeMessage | null): void => {
            if (msg) {
                callback(msg.content.toString())
                console.log(msg.content.toString())
                channel.ack(msg)
            }
        }

        this.channel?.consume(queue, consumer(this.channel, callback))
    }
    
}

export default RabbitMQ