import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { InitialService } from 'src/app/services/initial.service';
import { API, APIDefinition } from 'ngx-easy-table';
import { LyDialog } from '@alyle/ui/dialog';
import { InputComponent } from './input/input.component';
import { StateService } from 'src/app/services/state.service';

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%',
    margin: '10px 10px 10px 10px'
  },
  header: {
    padding: '15px 0px 0px 10px'
  },
  table: {
    fontSize: '14px'
  }
});

const STYLES_DIALOG = ({
  width: '100vw',
  height: '100vh',
  borderRadius: 0
});
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  @ViewChild('table') table: APIDefinition;
  projectForm = new FormGroup({
    ProjectName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    ProjectType: new FormControl('', Validators.required),
    ProjectAddress: new FormControl('', Validators.required),
    ProjectStatus: new FormControl('', Validators.required)
  });
  columns = [
    { key: 'ProjectName', title: 'Name' },
    { key: 'ProjectType', title: 'Type' },
    { key: 'ProjectAddressHalf', title: 'Address' },
    { key: 'ProjectStatus', title: 'Status' }
  ];
  data = []
  get ProjectName() {
    return this.projectForm.get('ProjectName')!;
  }
  constructor(private theme: LyTheme2, private master: InitialService,
    private _dialog: LyDialog) {
    this.fetchData();
  }

  fetchData() {
    this.master.getMasterProject({}).subscribe(pr => {
      pr.map(m => m.ProjectAddressHalf = m.ProjectAddress.substring(0, 20) + "...")
      this.data = pr;
    });
  }
  ngOnInit() {
  }

  showInput(obj) {
    const dialogInputInfo = this._dialog.open<InputComponent>(InputComponent, {
      data: { Obj: obj },
      maxWidth: null, // current style overrides
      maxHeight: null, // current style overrides
      containerClass: this.theme.style(STYLES_DIALOG)
    });
    dialogInputInfo.afterClosed.subscribe((res) => {
      if (res == 1) {
        this.fetchData();
      }
    });
  }

  eventEmitted($event) {
    if($event.value.row)
      this.showInput($event.value.row);
  }

  onChange($event): void {
    if ($event.target.value) {
      this.table.apiEvent({
        type: API.onGlobalSearch, value: $event.target.value,
      });
    }
  }
}
