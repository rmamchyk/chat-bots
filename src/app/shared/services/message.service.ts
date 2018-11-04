import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../models/Message';

@Injectable()
export class MessageService {
    constructor(private http: HttpClient) {}

    postMessage(msg: Message): Observable<Message> {
        return this.http.post<Message>('/message', msg);
    }

    getMessages(receiver: string) {
        return this.http.get<Message[]>(`/message/${receiver}`);
    }

    updateMessages(sender: string): Observable<{readAt: number}> {
        return this.http.put<{readAt: number}>(`/message`, {sender});
    }
}