import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/socket.service';
import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/models/Event';
import { User } from '../shared/models/User';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
   currentUser: User;
   onlineUsers: {username: string, image: string}[];

   constructor(private authService: AuthService,
      private socketService: SocketService) { }
   
   ngOnInit() {
      this.currentUser = this.authService.getCurrentUser();
      this.socketService.initSocket();

      this.socketService.onEvent(Event.CONNECT)
         .subscribe(() => {
            this.socketService.joinOnlineRoom({
               username: this.currentUser.username,
               image: this.currentUser.image
            });
         });

      this.socketService.onEvent(Event.DISCONNECT)
         .subscribe(() => {
            console.log('disconnected');
      });

      this.socketService.onEvent(Event.ONLINE_USERS)
      .subscribe((users) => {
         this.onlineUsers = users;
   });
   }
}
