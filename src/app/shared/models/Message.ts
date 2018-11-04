export class Message {
    public _id: string;
    public text: string;
    public sender: string;
    public receiver: string;
    public createdAt: number;
    public isRead: boolean;
    public readAt: number;
}