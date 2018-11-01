import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { Event } from '../shared/models/Event';
import { User } from '../shared/models/User';
import { Message } from '../shared/models/Message';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/services/socket.service';
import { UserService } from '../shared/services/user.service';
import { ValidatorHelper } from '../helpers/ValidatorHelper';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
   currentUser: User;
   users: User[];
   onlineOnly: boolean = true;
   searchInput: string = '';
   selectedUser: User = new User();

   messageForm: FormGroup;

   messages: Message[] = [];

   constructor(private authService: AuthService,
      private socketService: SocketService,
      private userService: UserService,
      private msgService: MessageService) { }

   get message() { return this.messageForm.get('message'); }

   onSubmitMessage() {
      if (this.messageForm.invalid) {
         return;
      }
      let msg = new Message();
      msg.sender = this.currentUser._id;
      msg.text = this.message.value.trim();
      msg.receiver = this.selectedUser._id;

      this.msgService.postMessage(msg).subscribe(
         res => {
            this.socketService.sendMessage(msg);
         },
         err => console.log(err)
      );

      this.messageForm.reset();
   }
   
   ngOnInit() {
      this.messageForm = new FormGroup({
         'message': new FormControl('', [Validators.required, ValidatorHelper.minLength(1)])
      });

      this.currentUser = this.authService.getCurrentUser();
      this.socketService.connect();

      this.socketService.onEvent(Event.CONNECT)
         .subscribe(() => {
            this.socketService.joinGlobalRoom({
               username: this.currentUser.username,
               image: this.currentUser.image
            });
         });

      this.socketService.onEvent(Event.DISCONNECT)
         .subscribe(() => {
            console.log('disconnected');
      });

      this.socketService.onEvent(Event.GLOBAL_ROOM_UPDATE)
         .subscribe((onlineUsers) => {
            this.users.forEach(user => {
               let found = _.find(onlineUsers, ou => ou.username === user.username);
               user.online = !!found;
            })
      });

      this.socketService.onMessage().subscribe(
         msg => {
            this.messages.push(msg);
         }
      );

      this.userService.getUsers().subscribe(
         users => {
            this.users = users;
         },
         err => console.log(err)
      );
   }

   showOnlineUsers() {
      this.onlineOnly = true;
   }

   showAllUsers() {
      this.onlineOnly = false;
   }

   onSelectUser(user: User) {
      this.selectedUser = user;
      this.socketService.joinPrivateRoom({
         sender: this.currentUser._id,
         receiver: this.selectedUser._id
      });
   }
}
