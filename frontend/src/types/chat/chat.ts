export interface IMessageChat {
    _id: string;
    userId: string;
    username: string;
    avatar: string;
    message: string;
    timestamp: string;
    messageType: 'text' | 'image' | 'file';
    deleted?: boolean;
    replyTo?: IReplyTo,
    reactions?: IReactions[]
}

export interface IReplyTo {
    _id: string;
    userId: string;
    username?: string;
    avatar?: string;
    message: string;
}

export interface IReactions {
    userId: string,
    emoji: string,
    username: string
}