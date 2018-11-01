import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

import {Event} from './models/Event';
import { Message } from './models/Message';

const SERVER_URL = 'http://localhost:4600';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public sendMessage(message: Message): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public joinOnlineRoom(user: {username: string, image: string}): void {
        this.socket.emit('join online room', user);
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }
}
