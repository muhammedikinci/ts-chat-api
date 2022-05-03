import IMessage from "../model/IMessage";
import Message from "../model/Message";
import PartialMessage from "../model/PartialMessage";
import IMessageRepository from "./IMessageRepository";

class MessageRepository implements IMessageRepository {
    async findBySenderAndReceiver(sender: string, receiver: string): Promise<IMessage | null> {
        return await Message.findOne<IMessage>({ sender, receiver });
    }

    async createMessage(sender: string, receiver: string, messages: PartialMessage[]): Promise<IMessage | null> {
        const message = new Message({ sender, receiver, messages })

        return await message.save()
    }

    async addMessage(sender: string, receiver: string, messages: PartialMessage): Promise<IMessage | null> {
        const conversation = await Message.findOne({ sender, receiver });

        if (!conversation) {
            return null
        }

        conversation.messages.push(messages)

        return await conversation.save()
    }
}

export default MessageRepository