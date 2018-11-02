import { Message } from './Message';

export class User {
    public _id: string;
    public username: string;
    public email: string;
    public token: string;
    public image: string;
    public online: boolean;
    public lastMessage: Message;
    public unreadCount: number;
}