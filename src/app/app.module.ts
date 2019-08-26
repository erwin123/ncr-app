import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppConfig, InitConfig } from './app-config';
import { APP_BASE_HREF } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
import {
  LyThemeModule,
  LY_THEME,
  LY_THEME_GLOBAL_VARIABLES,
  PartialThemeVariables,
  LyCommonModule,
} from '@alyle/ui';

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SharemodModule } from './sharemod/sharemod.module';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AuthguardService } from './services/authguard.service';
import { AuthService } from './services/auth.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export class CustomMinimaLight implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: '#213071',
    contrast: '#eeeeee'
  };
  accent = {
    default: '#e91e63',
    contrast: '#eeeeee'
  };
  calm = {
    default: '#29ce70',
    contrast: '#eeeeee'
  };
}

export class GlobalVariables implements PartialThemeVariables {
  SublimeLight = {
    default: `linear-gradient(135deg, ${'#FC5C7D'} 0%,${'#6A82FB'} 100%)`,
    contrast: '#fff',
    shadow: '#B36FBC'
  }; // demo: <button ly-button raised bg="SublimeLight">Button</button>
  button = {
    root: {
      borderRadius: '2em'
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LyThemeModule.setTheme('minima-light'),
    BlockUIModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    SharemodModule,
    LyCommonModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: InitConfig, deps: [AppConfig], multi: true },
    AuthguardService,
    AuthService,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name minima-light
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name minima-dark
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true }, // name minima-light
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables }, // global variables
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
