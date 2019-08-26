import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LyTheme2 } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { InitialService } from 'src/app/services/initial.service';
import * as SecureLS from 'secure-ls';
import * as moment from 'moment';
const STYLES = () => ({
  container: {
    maxWidth: '100%',
    margin: '10px 10px 10px 10px'
  },
  header: {
    margin: '10px'
  },
  table: {
    fontSize: '14px'
  }
});
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  projectForm = new FormGroup({
    Id: new FormControl({ value: 0, disabled: true }),
    ProjectName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    ProjectType: new FormControl('BUILDING', Validators.required),
    ProjectAddress: new FormControl('', Validators.required),
    ProjectStatus: new FormControl('1', Validators.required)
  });
  obj;
  selectedLocs: any[] = [];
  addedLoc;
  exampleLocMaster = [];
  projType = ["BUILDING", "FOUNDATION", "INFRA"];
  status = [{ text: "Active", val: 1 }, { text: "In Active", val: 0 }];
  locMaster: any[] = [];
  userRole: any;
  ls = new SecureLS();
  selectedPics: any[] = [];
  selectedUsers: any[] = [];
  addedPic;
  picMaster: any[] = [];
  userMaster: any[] = [];
  message: string = "";
  loadingPic=true;
  loadingUser=true;
  constructor(@Inject(LY_DIALOG_DATA) public data: any, private theme: LyTheme2
    , public dialogInputRef: LyDialogRef, public master: InitialService) {
    this.userRole = this.ls.get("user");
  }

  ngOnInit() {
    if (this.data.Obj != null) {
      this.resetForm(this.projectForm, this.data.Obj);
      this.obj = this.data.Obj;
      if (this.obj.Pics.length > 0) {
        this.selectedPics = [...this.obj.Pics]
      }
      if (this.obj.Locations.length > 0) {
        this.selectedLocs = [...this.obj.Locations]
      }
      if (this.obj.Users.length > 0) {
        this.selectedUsers = [...this.obj.Users]
      }
    }
    this.exampleLocMaster.forEach((c, i) => {
      this.locMaster.push({ Id: i, LocationName: c });
    });
    this.master.getMasterPic({ ProjectId: null }).subscribe(p => {
      this.picMaster = p;
      this.loadingPic =false;
    })
    this.master.getMasterUser({ ProjectId: null, Role:"user" }).subscribe(p => {
      this.userMaster = p;
      this.loadingUser =false;
    })
  }
  get ProjectName() {
    return this.projectForm.get('ProjectName')!;
  }

  get Id() {
    return this.projectForm.get('Id')!;
  }

  addTagLocFn(name) {
    return {
      Id: 0,
      RowStatus: 1,
      CreateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      CreateBy: "",
      LocationName: name,
      tag: true
    };
  }

  addTagPicFn(name) {
    return this.picMaster.find(f => f.PicName === name);
  }

  resetForm(form: FormGroup, data?: any) {
    if (data) {
      Object.keys(form.controls).forEach(key => {
        form.get(key).setValue(data[key]);
      });
    } else {
      form.reset();
      Object.keys(form.controls).forEach(key => {
        form.get(key).setErrors(null);
      });
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      if (this.selectedLocs.length == 0) {
        this.message = "Project need at least 1 Location";
        setTimeout(() => {
          this.message = "";
        }, 3000);
      } else {
        this.obj = this.projectForm.value;
        this.obj.Id = this.projectForm.get("Id").value;
        this.obj.RowStatus = 1;
        this.obj.Pics = this.selectedPics;
        this.obj.Users = this.selectedUsers;
        this.obj.Locations = this.selectedLocs.map(m => { m.CreateBy = this.userRole.Username; return m });
        if (this.obj.Id > 0) {
          this.obj.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss'),
            this.obj.UpdateBy = this.userRole.Username;
        } else {
          this.obj.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss'),
            this.obj.CreateBy = this.userRole.Username;
        }
        this.master.upsertMasterProject(this.obj).subscribe(res => {
          this.dialogInputRef.close(1)
        })
      }
    }
  }
}
