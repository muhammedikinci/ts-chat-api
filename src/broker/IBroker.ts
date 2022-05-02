interface IBroker {
    connect(queue: string): Promise<void>
    sendMessage(queue: string, message: Buffer): void
    consumeMessage(queue: string, callback: any): void
}

export default IBroker