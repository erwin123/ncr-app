import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { NcrReport, PushNotif } from 'src/app/model';
import { InitialService } from 'src/app/services/initial.service';
import { StateService } from 'src/app/services/state.service';
import * as SecureLS from 'secure-ls';
import { TransactService } from 'src/app/services/transact.service';
import * as async from 'async';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { DialogPicComponent } from '../dialog-pic/dialog-pic.component';

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%'
  },
  labelButton: {
    padding: '4px 0 0 4px'
  },
  setButton: {
    display: 'block',
    width: '100%',
    margin: '1em',
    marginBottom: '10px'
  }
});

const STYLES_DIALOG = ({
  width: '100vw',
  height: '100vh',
  borderRadius: 0
});

@Component({
  selector: 'app-base-ticket',
  templateUrl: './base-ticket.component.html',
  providers: [NgxImageCompressService],
  styleUrls: ['./base-ticket.component.scss']
})
export class BaseTicketComponent implements OnInit {
  @ViewChild("myDraw") child: any;
  @ViewChild('parentCanvas') elementView: ElementRef;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild('formDirective') form: NgForm;

  ls = new SecureLS();
  enums = [];
  projects = [];
  locations = [];
  pics = [];
  filteredPics = [];
  imgPath: Array<string> = new Array<string>();
  imgFile: Array<File> = new Array<File>();
  loadImg = false;
  ncrReport: NcrReport = new NcrReport();
  currentEnableMode: boolean = true;
  userRole: any;
  userRules: any;
  projectType = "";
  loader = true;
  filterSLA = "SLA-L";
  action = "";
  readonly classes = this._theme.addStyleSheet(STYLES);

  reportForm = new FormGroup({
    ProjectID: new FormControl('', Validators.required),
    ReportBy: new FormControl('', Validators.required),
    Founder: new FormControl('', Validators.required),
    Matters: new FormControl('', Validators.required),
    RootCause: new FormControl('', Validators.required),
    Scope: new FormControl('', Validators.required),
    SLA: new FormControl('', [Validators.required, Validators.minLength(5)]),
    PreventiveAction: new FormControl('', Validators.required),
    CorrectiveAction: new FormControl('', Validators.required),
    //DelayCause: new FormControl(''),
    Description: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    LocationID: new FormControl('', Validators.required),
    Pic: new FormControl('', Validators.required),
    LocationDetail: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    Notes: new FormControl('')
  });

  message = "";
  config: any;
  reportNoPhotoUrl = "";
  reportPhotoUrl = "";
  qs;

  constructor(private _theme: LyTheme2,
    private imageCompress: NgxImageCompressService, private _dialog: LyDialog,
    private master: InitialService, private transact: TransactService,
    private router: Router, private route: ActivatedRoute,
    private stateService: StateService, public _location: Location) {
    this.enums = this.ls.get("enums");
    this.userRole = this.ls.get("user");
    this.qs = this.ls.get("qs");
    this.userRules = this.ls.get("rules").filter(f => f.Ui === "base-ticket");
    this.config = this.master.getConfig();
    
  }

  ngOnInit() {
    switch (this.route.snapshot.paramMap.get('type')) {
      case "1":
        this.projectType = "BUILDING";
        break;
      case "2":
        this.projectType = "INFRA";
        break;
      case "3":
        this.projectType = "FOUNDATION";
        break;
      default:
        this.router.navigate['/main/trans/landing'];
        break;
    }
    this.setLock(true);
    this.reportPhotoUrl = this.config.Api.global_attachment;
    this.reportNoPhotoUrl = this.config.Api.global_img + "no-pic.jpg";


    if (this.userRole.Role === "user" || this.userRole.Role === "pic") {
      this.reportForm.get("Matters").setValidators(null);
      this.reportForm.get("RootCause").setValidators(null);
      this.reportForm.get("Scope").setValidators(null);
      this.reportForm.get("SLA").setValidators(null);
      this.reportForm.get("Pic").setValidators(null);
      this.reportForm.get("PreventiveAction").setValidators(null);
      this.reportForm.get("CorrectiveAction").setValidators(null);
    }

    this.getMasterProject((res) => {
      if (res === "done") {
        this.reportForm.get('ProjectID').valueChanges.subscribe(p => {
          if (p) {
            this.bindLocation(p);
            this.bindDDLPic(p);
            
            //this.pics = this.pics.filter(f => f.ProjectID == p);
          }
        });

        this.getMasterEnum((enums) => {
          if (enums === "done") {
            this.route.queryParams.subscribe(params => {
              if (params.mode == 1) { //view
                this.ncrReport.Id = parseInt(params.rpt);
                this.setLock(true);
                this.bindData(params.rpt);
                this.currentEnableMode = false;
              } else if (params.mode == 2) { //edit
                this.ncrReport.Id = parseInt(params.rpt);
                this.bindData(params.rpt);
                this.setLock(false);
                this.currentEnableMode = true;
              } else {
                setTimeout(() => {
                  this.loader = false;
                }, 500);
              }
            });
          }
        })
      }
    })

    // async.series([//fetch parameter
    //   (callback) => {
    //     this.master.getMasterProject({ ProjectType: this.projectType }).subscribe(res => {
    //       if (res.length > 0) {
    //         this.projects = res;
    //         this.setLock(false);
    // this.reportForm.get('ProjectID').valueChanges.subscribe(p => {
    //   if (p) {
    //     this.bindLocation(p);
    //     this.bindDDLPic(p);
    //     //this.pics = this.projects.find(fi => fi.Id == p).Pics;
    //   }
    // });
    //         callback(null, 'done');
    //       }
    //     }, err => { });
    //   },
    //   (callback) => {
    //     if (!this.enums) {
    //       this.master.getInitialMaster().subscribe(res => {
    //         this.ls.set("enums", res);
    //         this.enums = res;
    //         callback(null, 'done');
    //       });
    //     } else {
    //       callback(null, 'done');
    //     }
    //   }
    // ], //end of fetch parameter
    //   (err, results) => {
    //     if (results[0] === "done" && results[1] === "done") {

    //       this.route.queryParams.subscribe(params => {
    //         if (params.mode == 1) { //view
    //           this.ncrReport.Id = parseInt(params.rpt);
    //           this.setLock(true);
    //           this.bindData(params.rpt);
    //           this.currentEnableMode = false;
    //         } else if (params.mode == 2) { //edit
    //           this.ncrReport.Id = parseInt(params.rpt);
    //           this.bindData(params.rpt);
    //           this.setLock(false);
    //           this.currentEnableMode = true;
    //         } else {
    //           setTimeout(() => {
    //             this.loader = false;
    //           }, 500);
    //         }
    //       })
    //     }
    //   });
  }

  getMasterProject(callback) {
    if (this.ls.get('project')) {
      this.projects = this.ls.get('project').filter(f => f.ProjectType === this.projectType);
      this.setLock(false);
      callback('done');
    } else {
      this.master.getMasterProject({ ProjectType: this.projectType }).subscribe(res => {
        if (res.length > 0) {
          this.projects = res;
          this.setLock(false);
          callback('done');
        }
      }, err => { callback('error'); });
    }
  }

  getMasterEnum(callback) {
    if (!this.enums) {
      this.master.getInitialMaster().subscribe(enums => {
        this.ls.set("enums", enums);
        this.enums = enums;
        callback('done');
      });
    } else {
      callback('done');
    }
  }

  printBastk(Id) {
    window.open(this.config.Api.global_api + "/report/bastk/" + Id.toString(), "_blank");
  }

  bindDDLSLA(valueCode) {
    let selectedEnumProp = this.enums.find(f => f.EnumValue === valueCode);
    this.filterSLA = selectedEnumProp ? selectedEnumProp.EnumProp : '';
    setTimeout(() => {
      this.reportForm.get("SLA").setValue(selectedEnumProp.EnumValue);
    }, 100);
  }
  bindDDLPic(p) {
    if (p && this.projects.find(f => f.Id == p)) {
      this.pics = this.projects.find(f => f.Id == p).Pics;
    }
    // this.pics = [];
    // this.projects.map(f => f.Pics).map(x => {
    //   this.pics = this.pics.concat(x);
    // })
  }

  onApprove(e: Event) {
    e.preventDefault();
    this.reportForm.get("Notes").markAsTouched();
    this.reportForm.get("Matters").markAsTouched();
    this.reportForm.get("PreventiveAction").markAsTouched();
    this.reportForm.get("CorrectiveAction").markAsTouched();
    this.reportForm.get("RootCause").markAsTouched();
    this.reportForm.get("Scope").markAsTouched();
    this.reportForm.get("SLA").markAsTouched();
    this.reportForm.get("Pic").markAsTouched();
    this.ncrReport.ReportStatus = 1;
    this.form.ngSubmit.emit();
  }

  onReject() {
    this.stateService.setBlocking(1);
    if (this.reportForm.get("Notes").value === "") {
      this.message = "Please fill reject reason on Notes!";
      this.stateService.setBlocking(0);
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    } else {
      this.ncrReport.Notes = this.reportForm.get("Notes").value;
      this.ncrReport.ReportStatus = 7;
      this.ncrReport.ActionBy = this.userRole.Username;
      this.transact.putReport(this.ncrReport).subscribe(d => {
        this.showAlert("Report Rejected!");
      })
    }
  }

  changePic() {
    const dialogRefPic = this._dialog.open<DialogPicComponent>(DialogPicComponent, {
      data: { Pics: this.pics, Current: this.ncrReport.Pic }
    });
    dialogRefPic.afterClosed.subscribe(cl => {
      if (cl) {
        this.ncrReport.Pic = cl.Username;
        this.ncrReport.ActionBy = this.userRole.Username;
        this.ncrReport.AssignDate = moment().format('YYYY-MM-DD HH:mm:ss');
        this.transact.putReport(this.ncrReport).subscribe(res => {
          this.showAlert("Pic changed!");
        });
      }
    });
  }

  bindData(ReportID) {
    let criteria;
    switch (this.userRole.Role) {
      case "qs":
        criteria = { Id: ReportID }
        break;
      case "qs-pr":
        criteria = { Id: ReportID }
        break;
      case "pic":
        criteria = { Op: "OR", Prop: [{ Pic: this.userRole.Username }, { CreateBy: this.userRole.Username }] }
        break;
      case "user":
        criteria = { Id: ReportID, CreateBy: this.userRole.Username }
        break;
    }
    this.stateService.currentNCR.subscribe((s) => {
      
      if (s == null) {
        this.transact.getReport(criteria).subscribe(res => {
          this.mapToView(res.find(f => f.Id == ReportID))
        });
      } else {
        this.mapToView(s);
      }
    });
  }

  mapToView(report) {
    this.ncrReport = report;
    if (this.ncrReport.Id > 0) {
      this.stateService.setTitle(this.ncrReport.ReportNo + "|" + this.ncrReport.Project.ProjectName);
      // this.bindLocation(this.ncrReport.ProjectID);
      // this.bindDDLPic(this.ncrReport.ProjectID);

      if (this.ncrReport.SLA !== '')
        this.bindDDLSLA(this.ncrReport.SLA);

      //give time to bind location first
      //setTimeout(() => {
      this.resetForm(this.reportForm, this.ncrReport);
      if ((this.userRole.Role === "qs" || this.userRole.Role === "qs-pr") && this.ncrReport.ReportStatus == 0) {
        this.reportForm.get("Notes").enable();
        this.reportForm.get("Matters").enable();
        this.reportForm.get("PreventiveAction").enable();
        this.reportForm.get("CorrectiveAction").enable();
        this.reportForm.get("RootCause").enable();
        this.reportForm.get("Scope").enable();
        this.reportForm.get("SLA").enable();
        this.reportForm.get("Pic").enable();
      }
      if (this.ncrReport.Pic) {
        
        if (this.pics.find(f => f.Username === this.ncrReport.Pic))
          this.reportForm.get('Pic').setValue(this.pics.find(f => f.Username === this.ncrReport.Pic).PicName);
      }
      //}, 10500);

      if (this.ncrReport.ReportPhotos.length > 0) {
        this.imgPath = this.ncrReport.ReportPhotos.map(m => this.reportPhotoUrl + m.Filename);
        this.imgPath.forEach(f => {
          this.createFile(f, (out) => {
            this.imgFile.unshift(out);
          })
        })
      }
      setTimeout(() => {
        this.loader = false;
      }, 500);
    } else {
      this.showAlert("Report is invalid");
    }
  }

  createFile(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'blob';
    request.onload = () => {
      var reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload = (e: any) => {
        callback(this.dataURLtoFile(e.target.result, "pic1"));
      };
    };
    request.send();
  }

  bindLocation(projectId) {
    this.reportForm.get('LocationID').setValue('');
    if (projectId != 0 && this.projects.length > 0) {
      this.locations = this.projects.find(f => f.Id == projectId) ? this.projects.find(f => f.Id == projectId).Locations : [];
    }
  }

  openEditor(index, img) {
    const dialogRef = this._dialog.open<DialogEditComponent>(DialogEditComponent, {
      data: { image: img, editMode: this.currentEnableMode },
      maxWidth: null, // current style overrides
      maxHeight: null, // current style overrides
      containerClass: this._theme.style(STYLES_DIALOG)
    });
    dialogRef.afterClosed.subscribe((result) => {
      if (result != false) {
        this.imgPath[index] = result;
        this.imgFile[index] = this.dataURLtoFile(result, "edited" + index);
      }
    });
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  setLock(a) {
    if (a) {
      this.reportForm.disable();
      this.currentEnableMode = false;
    } else {
      this.reportForm.enable();
      this.currentEnableMode = true;
    }
  }

  showAlert(msg: string) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(['/main/trans/my-report']);
    });
  }
  onMyRule(ruleName) {
    return this.userRules.map(f => f.RuleName).indexOf(ruleName);
  }

  onSearchPic(searchValue: string) {
    this.filteredPics = this.pics.filter(f => f.PicName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1).splice(0, 4);
  }
  selectedPic(obj) {
    this.filteredPics = [];
    this.reportForm.get("Pic").setValue(obj.PicName);
  }

  detachImage(index) {
    this.imgFile.splice(index, 1);
    this.imgPath.splice(index, 1);
  }

  readUrlImg(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.loadImg = true;
      var reader = new FileReader();
      let fakeUrl;
      let fakeFile = event.target.files[0];
      reader.onload = (event: any) => {
        fakeUrl = event.target.result;
        setTimeout(() => {
          this.imageCompress.compressFile(fakeUrl, -2, 50, 50).then(
            result => {
              this.imgPath.unshift(result);
              this.imgFile.unshift(this.dataURLtoFile(result, fakeFile.name))
            }
          );
          this.loadImg = false;
          this.fileInput.nativeElement.value = "";
        }, 700);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  get description() {
    return this.reportForm.get('Description')!;
  }

  get locationDetail() {
    return this.reportForm.get('LocationDetail')!;
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

  goToProgress(reportId) {
    this.router.navigate(['main/trans/progress'],
      {
        queryParams: {
          rpt: reportId,
          mode: 1
        }
      });
  }

  onSubmit() {
    console.log(this.reportForm);
    if (!this.reportForm.valid) {
      this.message = "Please fill all required fields";
      if (this.ncrReport.ReportStatus = 1) {
        this.ncrReport.ReportStatus = 0;
      }
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }
    if (this.imgPath.length == 0) {
      this.message = "Report required at least 1 photo";
      if (this.ncrReport.ReportStatus = 1) {
        this.ncrReport.ReportStatus = 0;
      }
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }

    if (!this.pics.find(f => f.PicName === this.reportForm.get('Pic').value) && (this.userRole.Role === 'qs' || this.userRole.Role === 'qs-pr')) {
      this.message = this.reportForm.get('Pic').value + " not registered on selected project";
      if (this.ncrReport.ReportStatus = 1) {
        this.ncrReport.ReportStatus = 0;
      }
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }
    if (this.reportForm.valid) {
      this.stateService.setBlocking(1);
      let resultUpload = [];
      async.every(this.imgFile, (each, callback) => {
        if (each !== null) {
          this.transact.postUpload(each, "image").subscribe(event => {
            let eventRes: any;
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              //this.pdfProgress = percentDone;
            }
            if (event instanceof HttpResponse) {
              eventRes = event.body;
              resultUpload.push(eventRes.filename);
              callback(null, true);
            }
          }, err => {
            callback(null, false);
          });
        } else {
          callback(null, true);
        }
      }, (err, result) => {
        if (result) {
          this.ncrReport.ProjectType = this.projectType
          this.ncrReport.ProjectName = this.reportForm.get('ProjectID').value;
          this.ncrReport.ProjectID = this.reportForm.get('ProjectID').value;
          this.ncrReport.LocationID = this.reportForm.get('LocationID').value;
          this.ncrReport.ReportBy = this.reportForm.get('ReportBy').value;
          this.ncrReport.Founder = this.reportForm.get('Founder').value;
          this.ncrReport.Matters = this.reportForm.get('Matters').value;
          this.ncrReport.PreventiveAction = this.reportForm.get('PreventiveAction').value;
          this.ncrReport.CorrectiveAction = this.reportForm.get('CorrectiveAction').value;
          this.ncrReport.Scope = this.reportForm.get('Scope').value;
          this.ncrReport.RootCause = this.reportForm.get('RootCause').value;
          this.ncrReport.Description = this.reportForm.get('Description').value;
          this.ncrReport.Location = this.reportForm.get('LocationID').value;
          this.ncrReport.LocationDetail = this.reportForm.get('LocationDetail').value;
          this.ncrReport.Notes = this.reportForm.get('Notes').value;
          this.ncrReport.ActionBy = this.userRole.Username;
          this.ncrReport.ReportPhotos = resultUpload;
          this.ncrReport.SLA = this.reportForm.get('SLA').value;

          if (this.userRole.Role === "qs" || this.userRole.Role === "qs-pr") {
            this.ncrReport.ReportStatus = 1;
            this.ncrReport.Pic = this.pics.find(f => f.PicName === this.reportForm.get('Pic').value).Username;
            this.ncrReport.AssignDate = moment().format('YYYY-MM-DD HH:mm:ss');
          }

          this.transact.postReport(this.ncrReport).subscribe(res => {
            let notif: PushNotif = new PushNotif;
            if (this.ncrReport.Id == 0 && this.ncrReport.ReportStatus == 0) //created new
            {
              notif.Receiver = this.qs;
              notif.Message = this.ncrReport.Description;
              notif.Title = notif.Message = "New " + res[0].ReportNo + " (" + this.projectType + ") - " + this.ncrReport.ProjectName;
              notif.Sender = this.userRole.Username;
            } else if (this.ncrReport.Id != 0 && this.ncrReport.ReportStatus == 1) //approve
            {
              notif.Receiver.push(this.ncrReport.CreateBy);
              notif.Message = this.ncrReport.Description;
              notif.Title = notif.Message = "Verified " + res[0].ReportNo + " (" + this.projectType + ") - " + this.ncrReport.ProjectName;
              notif.Sender = this.userRole.Username;
            }
            this.transact.postPushNotif(notif).subscribe();
            this.imgPath = new Array<string>();
            this.imgFile = new Array<File>();
            this.ncrReport = new NcrReport();
            this.resetForm(this.reportForm);
            this.showAlert("Your report saved with number " + res[0].ReportNo);
          })
        } else {
          this.resetForm(this.reportForm);
          this.showAlert("Ops, error while uploading photo!");
        }
      });
    }
  }

}
