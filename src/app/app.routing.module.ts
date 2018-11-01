import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
    { path: '', component: ChatComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
    providers: [
        AuthGuard
    ]
})
export class AppRoutingModule {}