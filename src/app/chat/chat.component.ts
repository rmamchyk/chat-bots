import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { Event } from '../shared/models/Event';
import { User } from '../shared/models/User';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/services/socket.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
   currentUser: User;
   users: User[];
   onlineOnly: boolean = true;

   constructor(private authService: AuthService,
      private socketService: SocketService,
      private userService: UserService) { }
   
   ngOnInit() {
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
}
