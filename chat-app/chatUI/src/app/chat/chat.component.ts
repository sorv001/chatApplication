// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';
import {NgxNotificationService} from 'ngx-notification';
import {environment} from '../../environments/environment';
import {Chat, ChatMessage} from '../chat.model';
import {UserService} from '../chat.service';
import {io, SocketOptions, ManagerOptions} from 'socket.io-client';
import { AuthPayLoad } from '../auth.model';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../auth.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  // styleUrls: ['./chat.component.css']
  styles: [
    `
      ::ng-deep nb-layout-column {
        display: flex;
        justify-content: center;
      }
      :host {
        display: flex;
      }
      nb-chat {
        width: 300px;
        margin: 1rem;
      }
    `,
  ],
})
export class ChatComponent{

  payload?: AuthPayLoad;
  username?: string;
  constructor(
    private readonly userHttpService: UserService,
    private readonly ngxNotificationService: NgxNotificationService,
    private route: ActivatedRoute,
    private authenticationService:AuthService,
  ) {

    this.route.queryParams.subscribe(param => {
      this.authenticationService.getToken(param['code']).subscribe(params =>{
        this.token = params.accessToken;
        this.payload = jwt_decode(this.token);
        console.log(this.payload);
        this.username =
          this.payload?.user?.firstname ?? this.payload?.user?.username;
          this.channelUUID = environment.CHAT_ROOM;
          this.enterToken();
      })
    });

  }

 
  public messages: ChatMessage[] = [];
  public senderUUID = '';
  public channelUUID = environment.CHAT_ROOM;
  public token = '';
  public inRoom = true;

  socketIOOpts: Partial<ManagerOptions & SocketOptions> = {
    path: '/socket.io',
    transports: ['polling'],
    upgrade: false,
  };

  // socket = io(environment.SOCKET_ENDPOINT, this.socketIOOpts);

  enterToken() {
    console.log('002');
    this.userHttpService.getUserTenantId(this.token).subscribe(data => {
      this.senderUUID = data;
    });
  }

  leaveRoom() {
    console.log('001');
    this.messages = [];
    this.inRoom = false;
  }

  getMessages() {
    console.log('004');
    this.inRoom = true;
    this.userHttpService.get(this.token, this.channelUUID).subscribe(data => {
      this.messages = [];
      for (const d of data) {
        const temp: ChatMessage = {
          body: d.body,
          subject: d.subject,
          channelType: '0',
          reply: false,
          sender: 'sender',
        };
        if (d.createdBy === this.senderUUID) {
          temp.sender = 'User';
          temp.reply = true;
        }
        this.messages.push(temp);
      }
    });

    this.subcribeToNotifications();
  }

  subcribeToNotifications() {
    
    const socket = io(environment.SOCKET_ENDPOINT, this.socketIOOpts);
    
    socket.on('connect', () => {
      const channelsToAdd: string[] = [this.channelUUID];
      socket.emit('subscribe-to-channel', channelsToAdd);
    });

    socket.on('userNotif', message => {
      console.log(message); //NOSONAR

      const temp: ChatMessage = {
        body: message.body,
        subject: message.subject,
        channelType: '0',
        reply: false,
        sender: 'sender',
      };
      if(message.subject != this.senderUUID){
        this.ngxNotificationService.sendMessage('You got a message', 'success', 'top-right');
        this.messages.push(temp);
      }

    });
  }

  // sonarignore:start
  sendMessage(event: {message: string}, userName: string, avatar: string) {
    // sonarignore:end
    console.log('005');
    if (!this.inRoom) {
      return;
    }
    const chatMessage: ChatMessage = {
      body: event.message,
      subject: 'new message',
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
      reply: true,
      sender: userName,
    };

    const dbMessage: Chat = {
      body: event.message,
      subject: this.senderUUID,
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
    };

    // sonarignore:start
    this.userHttpService.post(dbMessage, this.token).subscribe(response => {
      // sonarignore:end
      this.messages.push(chatMessage);
    });
  }
}
