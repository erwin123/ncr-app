import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { LyTheme2 } from '@alyle/ui';
import { InitialService } from '../services/initial.service';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';
import { trigger, animate, style, group, query, transition } from '@angular/animations';
import * as SecureLS from 'secure-ls';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from '../services/auth.service';
const STYLES = ({
  drawerContainer: {
    height: 'calc(100vh - 64px)',
    transform: 'translate3d(0,0,0)'
  },
  drawerContentArea: {
    padding: '1%',
    height: '100%',
    overflow: 'auto'
  },
  icon: {
    margin: '0 8px'
  },
  grow: {
    flex: 1
  }
});

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('routerTransition', [
      transition('* => feed', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })
          , { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('feed => *', [
        group([
          query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('* => progress', [
        group([
          query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('progress => baseticket', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })
          , { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class MainComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  readonly classes = this._theme.addStyleSheet(STYLES);
  menus = [];
  sidemenus = [];
  title = "";
  subtitle = "";
  ls = new SecureLS();
  project = [];
  userRole;
  adminMenu = {
    "Text": "Administrator",
    "Icon": "fas fa-user-cog",
    "RuleName": "qs",
    "Path": "/admin/mod/project"
  }
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _theme: LyTheme2, changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private initialService: InitialService, private router: Router,
    private stateService: StateService, private auth: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.userRole = this.ls.get("user");
    this.project = this.ls.get("project");
  }

  ngOnInit() {
    this.stateService.currentBlocking.subscribe(b => {
      if (b == 1) {
        this.blockUI.start('Loading...');
      }
      else {
        this.blockUI.stop();
      }
    })
    this.initialService.getJSON("main-menu.json").subscribe(res => {
      this.menus = res;
      if (this.userRole.Role === "qs") {
        this.menus.push(this.adminMenu);
      }else{
        this.menus = this.menus.filter(f=>f.ProjectType === this.project[0].ProjectType || f.ProjectType === 'ALL');
      }
    })
    this.initialService.getJSON("side-menu.json").subscribe(res => {
      this.sidemenus = res;
      if (this.userRole.Role === "qs") {
        this.sidemenus.push(this.adminMenu);
      }
    });
    this.stateService.setTitle("NCR Control");
    this.stateService.currentTitle.subscribe(r => {
      if (r.split('|').length > 1) {
        this.title = r.split('|')[0];
        this.subtitle = r.split('|')[1];
      } else {
        this.title = r;
        this.subtitle = "";
      }
    });
  }

  goTo(path, title) {
    if (title === "Logout") {
      localStorage.removeItem("rules");
      localStorage.removeItem("user");
      localStorage.removeItem("enums");
      localStorage.removeItem("project");
      localStorage.removeItem("qs");
      localStorage.removeItem("deviceInfo");
      localStorage.removeItem("memp");
      localStorage.removeItem("_secure__ls__metadata");
      setTimeout(() => {
        this.auth.startLogout();
      }, 1000);
    } else if (title === "Administrator" || title === "Info") {
      setTimeout(() => {
        this.stateService.setTitle(title);
        this.router.navigate([path]);
      }, 500);
    } else {
      this.title = title;
      this.stateService.setTitle(title);
      this.router.navigate([path]);
    }
  }
}
