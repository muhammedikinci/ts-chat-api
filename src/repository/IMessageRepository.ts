import IMessage from "../model/IMessage"
import PartialMessage from "../model/PartialMessage"

interface IMessageRepository {
    findBySenderAndReceiver(sender: string, receiver: string): Promise<IMessage | null>
    createMessage(sender: string, receiver: string, messages: PartialMessage[]): Promise<IMessage | null>
    addMessage(sender: string, receiver: string, messages: PartialMessage): Promise<IMessage | null>
}

export default IMessageRepository