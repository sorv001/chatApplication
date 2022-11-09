import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbThemeModule, NbLayoutModule, NbChatModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import {HttpClientModule} from '@angular/common/http';
//import {ChatComponent} from './chat/chat.component';
// import { UserService } from './chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgxNotificationModule} from 'ngx-notification';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component'
import { UserService } from './chat.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name:'default'}),
    NbLayoutModule,
    NbEvaIconsModule,
    FormsModule,
    HttpClientModule,
    NbChatModule,
    ReactiveFormsModule
  ],
  providers: [UserService],//userService add 
  bootstrap: [AppComponent]
})
export class AppModule { }
