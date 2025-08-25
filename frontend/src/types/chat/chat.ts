export interface IMessageChat {
    _id: string;
    userId: string;
    username: string;
    avatar: string;
    message: string;
    timestamp: string;
    messageType: 'text' | 'image' | 'file';
}