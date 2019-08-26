import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';

import { AuthguardService } from './services/authguard.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';


const routes: Routes = [
  // { path: 'login', component: LoginComponent, data: { state: 'login' } },
  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  },
  {
    path: 'main', component: MainComponent, canActivate: [AuthguardService],
    children: [
      {
        path: 'trans',
        loadChildren: './main/main.module#MainModule',
        data: { state: 'main' }
      },
    ]
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
  },
  // { path: '**', redirectTo: 'main/trans/landing' },
  // otherwise redirect to home
  { path: '', redirectTo: 'main/trans/my-report', pathMatch: 'full' },
  { path: '**', redirectTo: 'main/trans/my-report' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
