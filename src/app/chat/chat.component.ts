import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class ChatComponent implements OnInit, AfterViewChecked {
   @ViewChild('messageList') messageList: ElementRef;

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
      msg.sender = this.currentUser.username;
      msg.text = this.message.value.trim();
      msg.receiver = this.selectedUser.username;
      msg.createdAt = Date.now()

      this.msgService.postMessage(msg).subscribe(
         savedMsg => {
            this.socketService.sendMessage(savedMsg);
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
            this.userService.getUsers().subscribe(
              users => {
                this.users = users;
                this.socketService.joinGlobalRoom({
                  username: this.currentUser.username,
                  image: this.currentUser.image
              });
              },
              err => console.log(err)
            );
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
            if (msg.sender == this.selectedUser.username) {
              this.messages.push(msg);
              let sender = _.find(this.users, u => u.username === msg.sender);
              sender.lastMessage = msg;
              this.msgService.updateMessages(msg.sender).subscribe(
                data => {
                  this.socketService.messageSeen({
                    readAt: data.readAt, 
                    sender: msg.sender
                  });
                },
                err => console.log(err)
            );
            } else if (msg.sender == this.currentUser.username) {
              this.messages.push(msg);
              let receiver = _.find(this.users, u => u.username === msg.receiver);
              receiver.lastMessage = msg;
            } else {
              let sender = _.find(this.users, u => u.username === msg.sender);
              sender.lastMessage = msg;
              sender.unreadCount++;
            }
         }
      );

      this.socketService.onMessageSeen().subscribe(
        data => {
          this.messages.forEach(msg => {
            if(!msg.isRead) {
              msg.readAt = data.readAt;
              msg.isRead = true;
            }
          });
        }
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

      this.msgService.updateMessages(this.selectedUser.username).subscribe(
        data => {
          this.selectedUser.unreadCount = 0;
          
          this.socketService.messageSeen({
            readAt: data.readAt,
            sender: this.selectedUser.username
          });

          this.msgService.getMessages(this.selectedUser.username).subscribe(
            messages => {
               this.messages = messages;
            },
            err => console.log(err)
         );
        },
        err => console.log(err)
      );
   }

   ngAfterViewChecked(): void {
        this.scrollToBottom();
    }
  
    private scrollToBottom(): void {
      try {
        this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
      } catch (err) {
      }
    }
}
