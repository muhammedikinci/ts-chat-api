import PartialMessage from "./PartialMessage";

interface IMessage {
    sender: string;
    receiver: string;
    messages: PartialMessage[];
}

export default IMessage