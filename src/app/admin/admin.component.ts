import { Component, OnInit } from '@angular/core';
import { LyTheme2,ThemeVariables } from '@alyle/ui';
import { Router } from '@angular/router';

const styles = () =>({
  grow: {
    flexGrow: 1
  }
});
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  classes = this.theme.addStyleSheet(styles);
  constructor(private theme: LyTheme2, private router: Router) { }
  ngOnInit() {
  }
  goToUserMode() {
    this.router.navigate(["main/trans/my-report"]);
  }
}
