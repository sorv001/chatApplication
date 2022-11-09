import { Component, OnInit } from '@angular/core';

import {NgxNotificationService} from 'ngx-notification';
import { environment } from 'src/environments/environment';

import {Chat, ChatMessage} from '../chat.model';

import { UserService } from '../chat.service';
import {io, SocketOptions, ManagerOptions} from 'socket.io-client';

import { AuthPayLoad } from '../auth.model';

import { ActivatedRoute } from '@angular/router';

import jwt_decode from 'jwt-decode';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  payload?: AuthPayLoad;
  username?: string;

  constructor(
    private readonly userHttpService: UserService,
    private readonly ngxNotificationService: NgxNotificationService,
    private route: ActivatedRoute,
    private authenticationService: AuthService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param =>{
      this.authenticationService.getToken(param['code']).subscribe(params =>{
        this.token = params.accessToken;
        this.payload = jwt_decode(this.token);
        console.log(this.payload);
        this.username = 
          this.payload?.user?.firstname?? this.payload?.user?.username;
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

  socketIOOpts : Partial<ManagerOptions & SocketOptions> = {
    path: '/socket.io',
    transports: ['polling'],
    upgrade: false,
  };

  enterToken(){
    this.userHttpService.getUserTenantId(this.token).subscribe(data => {
      this.senderUUID = data;
    });
  }

  leaveRoom(){
    this.messages = [];
    this.inRoom = false;
  }

  getMessage(){
    this.inRoom = true;
    this.userHttpService.get(this.token , this.channelUUID).subscribe(data => {
      this.messages = [];
      for(const d of data){
        const temp: ChatMessage = {
          body: d.body,
          subject: d.subject,
          channelType: '0',
          reply: false,
          sender: 'sender',
        };
        if(d.createdBy === this.senderUUID){
          temp.sender = 'User';
          temp.reply = true;
        }
        this.messages.push(temp);
      }
    });
    this.subscribeToNotification();
  }

  subscribeToNotification(){
    const socket =  io(environment.SOCKET_ENDPOINT, this.socketIOOpts);
    socket.on('connect',()=>{
      const channelsToAdd: string[] = [this.channelUUID];
      socket.emit('subscribe-to-channel',channelsToAdd);
    });

    socket.on('userNotif', message => {
      console.log(message);
      const temp: ChatMessage = {
        body: message.body,
        subject: message.subject,
        channelType: '0',
        reply: false,
        sender:'sender',
      };
      if(message.subject!=this.senderUUID){
        this.ngxNotificationService.sendMessage('You got a Message!','success','top-right');
        this.messages.push(temp);
      }
    });
  }

  sendMessage(event:{message:string},userName:string, avatar: string){
    if(!this.inRoom){
      return ;
    }

    const chatMessage: ChatMessage = {
      body:event.message,
      subject:'new message',
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType:'0',
      reply: true,
      sender: userName
    }

    const dbMessage: Chat = {
      body: event.message,
      subject: this.senderUUID,
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
    };

    this.userHttpService.post(dbMessage,this.token).subscribe(response => {
      this.messages.push(chatMessage);
    })

  }

}
