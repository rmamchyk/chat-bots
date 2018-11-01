import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

import {Event} from '../models/Event';
import { Message } from '../models/Message';

const SERVER_URL = 'http://localhost:4600';

@Injectable()
export class SocketService {
    private socket;

    public connect(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public sendMessage(message: Message): void {
        this.socket.emit(Event.MESSAGE, message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on(Event.MESSAGE, (data: Message) => observer.next(data));
        });
    }

    public joinGlobalRoom(user: {username: string, image: string}): void {
        this.socket.emit(Event.JOIN_GLOBAL_ROOM, user);
    }

    public onGlobalRoomUpdate(): Observable<{username: string, image: string }[]> {
        return new Observable<{username: string, image: string }[]>(observer => {
            this.socket.on(Event.GLOBAL_ROOM_UPDATE, data => observer.next(data));
        })
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }
}
