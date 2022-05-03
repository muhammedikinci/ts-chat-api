interface IBroker {
    connect(): Promise<void>
    sendMessage(queue: string, message: Buffer): void
    consumeMessage(queue: string, callback: any): void
}

export default IBroker