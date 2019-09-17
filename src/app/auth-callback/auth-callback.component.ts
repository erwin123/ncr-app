import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';
import * as moment from 'moment';
import { InitialService } from '../services/initial.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'auth-callback',
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
  ls = new SecureLS();
  message = "Loading Modules...";
  constructor(private authService: AuthService, private router: Router, private initial: InitialService) { }

  ngOnInit() {
    setTimeout(() => this.authService.completeAuthentication()
      .then(() => {
        //this.insertingUser(this.authService.getClaims());
        localStorage.removeItem("rules");
        localStorage.removeItem("user");
        localStorage.removeItem("enums");
        localStorage.removeItem("project");
        localStorage.removeItem("qs");
        localStorage.removeItem("deviceInfo");
        localStorage.removeItem("memp");
        localStorage.removeItem("_secure__ls__metadata");

        this.authService.getUserLogin({ Username: this.authService.getClaims().name }).subscribe(aut => {
          if (aut[0]) {
            if (aut[0].Project || aut[0].Role === 'qs') {
              this.afterLoggedIn(aut);
            } else {
              this.message = "Your account generated, please contact your Subordinary to actived.";
            }
          } else {
            this.insertingUser(this.authService.getClaims());
          }
        });

        // else {
        //   this.router.navigate(['main/trans/my-report']);
        // }
      })
      .catch((ex) => this.authService.startAuthentication()), 100);

    // if (!this.authService.isLoggedIn()) {
    //   setTimeout(() => this.authService.completeAuthentication()
    //     .then(() => {
    //       this.insertingUser(this.authService.getClaims());
    //     })
    //     .catch((ex) => this.authService.startAuthentication()), 100)
    // } else {
    //   if (!this.ls.get("user")
    //     || !this.ls.get("rules")
    //     || !this.ls.get("qs")
    //     || !this.ls.get("enums")) {
    //     this.authService.getUserLogin({ Username: this.authService.getClaims().name }).subscribe(aut => {
    //       if (aut[0]) {
    //         if (aut[0].Project || aut[0].Role === 'qs') {
    //           this.afterLoggedIn(aut);
    //         } else {
    //           this.message = "Your account generated, please contact your Subordinary to actived.";
    //         }
    //       } else {
    //         this.insertingUser(this.authService.getClaims());
    //       }
    //     });
    //   } else {
    //     this.router.navigate(['main/trans/my-report']);
    //   }
    // }
  }

  insertingUser(claims) {
    this.authService.getUserLogin({ Username: claims.name }).subscribe(aut => {
      if (aut.length > 0) {
        this.afterLoggedIn(aut);
      } else {
        if (claims.role === "qs") {
          this.authService.postUser(this.setObjUser(claims, "qs")).subscribe(i => {
            this.afterLoggedIn([...[], i]);
            //this.router.navigate(['main/trans/my-report']);
          });
        } else if (claims.role === "user" || claims.role === "pic") {
          this.authService.postUser(this.setObjUser(claims, claims.role)).subscribe(i => {
            this.message = "Your account generated, please contact your Subordinary to actived ";
          });
          if (claims.role === "pic") {
            this.authService.postPic({
              RowStatus: 1,
              Username: claims.name,
              PicName: claims.FullName.length > 0 ? claims.FullName : claims.name,
              ProjectID: null,
              CreateBy: claims.name,
              CreateDate: moment().format('YYYY-MM-DD HH:mm:ss')
            }).subscribe(p => {
              this.message = this.message + "(As PIC Project).";
            })
          }
        }
        else if (claims.role.find(f => f === "pic" || f === "user")) {
          this.authService.postUser(this.setObjUser(claims, claims.role.find(f => f === "pic" || f === "user"))).subscribe(i => {
            this.message = "Your account generated, please contact your Subordinary to actived ";
          });
          if (claims.role.find(f => f === "pic")) {
            this.authService.postPic({
              RowStatus: 1,
              Username: claims.name,
              PicName: claims.FullName.length > 0 ? claims.FullName : claims.name,
              ProjectID: null,
              CreateBy: claims.name,
              CreateDate: moment().format('YYYY-MM-DD HH:mm:ss')
            }).subscribe(p => {
              this.message = this.message + "(As PIC Project).";
            })
          }
        } else if (claims.role.find(f => f === "qs")) {
          this.authService.postUser(this.setObjUser(claims, "qs")).subscribe(i => {
            this.afterLoggedIn([...[], i]);
            //this.router.navigate(['main/trans/my-report']);
          });
        }
      }
    });
  }

  setObjUser(claims, role) {
    console.log(claims);  
    return {
      RowStatus: 1,
      Username: claims.name,
      Email: claims.Email,
      PhoneNumber: claims.PhoneNumber,
      ProjectID: null,
      Role: role,
      Name: claims.FullName.length > 0 ? claims.FullName : claims.name,
      CreateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      CreateBy: claims.name
    }
  }

  afterLoggedIn(aut) {
    this.ls.set("user", aut[0]);

    forkJoin(
      this.initial.getMasterRules({ Role: aut[0].Role }),
      this.authService.getUserLogin({ Role: "qs" }),
      this.initial.getInitialMaster(),
      this.initial.getMasterProject({})
    ).subscribe(res => {
      this.ls.set("rules", res[0]);
      this.ls.set("qs", res[1].map(m => m.Username));
      this.ls.set("enums", res[2]);
      this.ls.set("project", res[3]);
      this.authService.putUserLogin({Username:aut[0].Username}).subscribe();
      if (aut[0].Role !== 'qs') {
        console.log(res[3]);
        this.ls.set("project", [...[], res[3].find(f => f.Id == aut[0].Project.Id)]);
      }
    }, err => { }, () => { this.router.navigate(['/main/trans/my-report']); })
  }
}
