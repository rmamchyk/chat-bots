import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { AppRoutingModule } from './app.routing.module';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { ErrorInterceptor } from './shared/error.interceptor';
import { DropdownDirective } from './shared/dropdown.directive';
import { SocketService } from './shared/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HeaderComponent,
    DropdownDirective
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    SocketService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

