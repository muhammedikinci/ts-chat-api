import Broker from "../../../broker/Broker";

const mockBroker: Broker = {
    userExchange: "",
    userQueue: "",
    messageExchange: "",
    messageQueue: "",
    connect: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    sendMessage: function (queue: string, message: Buffer): void {
        
    },
    consumeMessage: function (queue: string, callback: any): void {
        throw new Error("Function not implemented.");
    }
}

export default mockBroker