import IMessage from "../../../model/IMessage";
import PartialMessage from "../../../model/PartialMessage";
import IMessageRepository from "../../../repository/IMessageRepository";

const mockMessageRepository: IMessageRepository = {
    findBySenderAndReceiver: function (sender: string, receiver: string): Promise<IMessage | null> {
        throw new Error("Function not implemented.");
    },
    createMessage: function (sender: string, receiver: string, messages: PartialMessage[]): Promise<IMessage | null> {
        throw new Error("Function not implemented.");
    },
    addMessage: function (sender: string, receiver: string, messages: PartialMessage): Promise<IMessage | null> {
        throw new Error("Function not implemented.");
    }
}

export default mockMessageRepository