import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service'
import * as SecureLS from 'secure-ls';

@Injectable()
export class AuthguardService implements CanActivate {

  // constructor(private router: Router) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   if (localStorage.getItem('currentUser')) {

  //     return true;
  //   } 

  //   // not logged in so redirect to login page with the return url
  //   this.router.navigate(['main/login'], { queryParams: { returnUrl: state.url } });
  //   return false;
  // }
  ls = new SecureLS();
  constructor(private authService: AuthService) {
  }

  canActivate(): boolean {
    //return true;
    if (this.authService.isLoggedIn()) {
      return true;
    }
    else {
      this.authService.startAuthentication();
      return false;
    }
  }
}