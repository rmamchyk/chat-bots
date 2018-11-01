import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../models/Message';

@Injectable()
export class MessageService {
    constructor(private http: HttpClient) {}

    postMessage(msg: Message) {
        return this.http.post('/message', {
            text: msg.text,
            receiver: msg.receiver
        });
    }
}