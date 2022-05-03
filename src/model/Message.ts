import { Schema, model } from 'mongoose';
import IMessage from './IMessage';
import PartialMessage from './PartialMessage';

const MessageSchema = new Schema<IMessage>({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    messages: { type: Array<PartialMessage>(), required: true }
})

const Message = model<IMessage>('Message', MessageSchema)

export default Message