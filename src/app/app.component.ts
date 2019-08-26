import { Component, HostListener } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { AuthService } from './services/auth.service';

const STYLES = (theme: ThemeVariables) => ({
  '@global': {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly classes = this.theme.addStyleSheet(STYLES);
  title = 'ncr-app';

  constructor(private theme: LyTheme2, private authService:AuthService) {
    this.authService.initialLoad();
  }
}
