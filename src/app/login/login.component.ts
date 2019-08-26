import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InitialService } from '../services/initial.service';
import * as SecureLS from 'secure-ls';
import { AuthguardService } from '../services/authguard.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  ls = new SecureLS();
  constructor(private router: Router, private initial: InitialService, private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    // this.initial.getJSON("user.json").subscribe(res => {
    //   let validUser = res.find(f => f.Username === this.username && f.Password === this.password);
    //   if (validUser) {
    //     this.ls.set("user", validUser);
    //     this.initial.getMasterRules({ Role: validUser.Role }).subscribe(res => {
    //       this.ls.set("rules", res);
    //     }, err => { }, () => { this.router.navigate(['/main/trans/my-report']); })

    //   } else {
    //     window.alert("Wrong Uid / Password");
    //   }
    // })

    this.auth.getUserLogin({ Username: this.username }).subscribe(aut => {
      if (aut) {
        //this.afterLoggedIn(aut);
        // this.ls.set("user", aut[0]);
        // this.initial.getMasterRules({ Role: aut[0].Role }).subscribe(res => {
        //   this.ls.set("rules", res);
        // }, err => { }, () => { this.router.navigate(['/main/trans/my-report']); })

      } else {
        window.alert("Wrong Uid / Password");
      }
    })

  }

  // afterLoggedIn(aut) {
  //   this.ls.set("user", aut[0]);
  //   forkJoin(
  //     this.initial.getMasterRules({ Role: aut[0].Role }),
  //     this.auth.getUser({ Role: "qs" }),
  //     this.initial.getInitialMaster()
  //     ).subscribe(res=>{
  //     this.ls.set("rules", res[0]);
  //     this.ls.set("qs", res[1].map(m=>m.Username));
  //     this.ls.set("enums", res[2]);
  //   }, err => { }, () => { this.router.navigate(['/main/trans/my-report']); })
  // }

}
