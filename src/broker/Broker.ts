import IBroker from "./IBroker";

abstract class Broker implements IBroker {
    abstract userExchange: string
    abstract userQueue: string

    abstract messageExchange: string
    abstract messageQueue: string

    abstract connect(): Promise<void>
    abstract sendMessage(queue: string, message: Buffer): void
    abstract consumeMessage(queue: string, callback: any): void
}

export default Broker