import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { NcrReport, NcrReportProgress, NcrReportProgressDetail, PushNotif } from 'src/app/model';
import { ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { TransactService } from 'src/app/services/transact.service';
import * as SecureLS from 'secure-ls';
import { Options } from 'ng5-slider';
import * as moment from 'moment';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import * as async from 'async';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { InitialService } from 'src/app/services/initial.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

const STYLES_DIALOG = ({
  width: '100vw',
  height: '100vh',
  borderRadius: 0
});

const STYLES = ({
  labelButton: {
    padding: '4px 0 0 4px'
  }
});


@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  providers: [NgxImageCompressService],
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  @ViewChild("fileInput") fileInput: ElementRef;
  imgPath: Array<string> = new Array<string>();
  imgFile: Array<File> = new Array<File>();
  loadImg = false;
  currentEnableMode = true;
  ncrReport: NcrReport = new NcrReport();
  actionNotes = "";
  cost = 0;
  reportProgresses: NcrReportProgress = new NcrReportProgress();
  reportProgressesDetail: NcrReportProgressDetail = new NcrReportProgressDetail();
  loader = true;
  userRole;
  userRules;
  remaining = "";
  late = 0;
  ls = new SecureLS();
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    showTicks: true,
    tickStep: 20,
    step: 10,
    translate: (value: number): string => {
      return value + "%";
    }
  };

  reportNoPhotoUrl = "";
  reportPhotoUrl = "";
  config;
  sla;
  message = "";
  delayCause = "";
  qs;
  constructor(private _dialog: LyDialog, private _theme: LyTheme2,
    public _location: Location, private route: ActivatedRoute, private master: InitialService,
    private imageCompress: NgxImageCompressService, private stateService: StateService,
    private transact: TransactService, private theme: LyTheme2) {
    this.userRules = this.ls.get("rules").filter(f => f.Ui === "base-ticket");
    this.userRole = this.ls.get("user");
    this.sla = this.ls.get("enums");
    this.config = this.master.getConfig();
    this.qs = this.ls.get("qs");
  }

  ngOnInit() {
    this.reportPhotoUrl = this.config.Api.global_attachment;
    this.reportNoPhotoUrl = this.config.Api.global_img + "no-pic.jpg";
    this.route.queryParams.subscribe(params => {
      if (params.mode == 1) { //view
        this.ncrReport.Id = parseInt(params.rpt);
        this.bindData(params.rpt);
        this.currentEnableMode = false;
      } else if (params.mode == 2) { //edit
        this.ncrReport.Id = parseInt(params.rpt);
        this.bindData(params.rpt);
        this.currentEnableMode = true;
      } else {
        setTimeout(() => {
          this.loader = false;
        }, 800);
      }
    })
  }

  bindData(ReportID) {
    let criteria;
    switch (this.userRole.Role) {
      case "qs":
        criteria = { Id: ReportID }
        break;
      case "pic":
        //criteria = { Op: "OR", Prop: [{ Pic: this.userRole.Username }, { CreateBy: this.userRole.Username }] }
        criteria = { Id: ReportID, Pic: this.userRole.Username }
        break;
      case "user":
        criteria = { Id: ReportID, CreateBy: this.userRole.Username }
        break;
    }

    this.stateService.currentNCR.subscribe(s => {
      if (s == null) {
        this.stateService.setBlocking(1);
        this.transact.getReport(criteria).subscribe(res => {
          this.ncrReport = res[0];
          if (this.ncrReport.ReportProgresses.length > 0) {
            this.getReportProgress(this.ncrReport, progress => {
              this.reportProgresses = progress;
              if (this.reportProgresses.Photo != null)
                this.imgPath.unshift(this.reportPhotoUrl + this.reportProgresses.Photo);
              this.value = progress.Percentage;
              this.limitBottomLine(this.value);
              let slaDuration = this.sla.find(f => f.EnumText === this.ncrReport.SLA);
              let days = moment.duration(moment().add(slaDuration.EnumValue, 'days').diff(this.ncrReport.AssignDate)).asDays();
              if (this.ncrReport.ReportStatus == 4 || this.ncrReport.ReportStatus == 5) {
                days = moment.duration(moment(this.ncrReport.FinishDate).diff(this.ncrReport.AssignDate)).asDays();
              }
              if (days > parseInt(this.sla.find(f => f.EnumText === this.ncrReport.SLA).EnumValue)) {
                this.late = 1
                this.remaining = "Progress already late about " + Math.floor(days) + " days";
              } else {
                this.late = 0;
                this.remaining = "Remaining target " + Math.floor(Math.abs(days)) + " days";
              }
              if (this.ncrReport.ReportStatus == 5 || this.ncrReport.ReportStatus == 4) {
                this.cost = this.ncrReport.TotalCost;
                this.actionNotes = progress.Notes;
                this.delayCause = this.ncrReport.DelayCause;
              }
              this.stateService.setBlocking(0);
            });
          } else {
            //blm ada progress
          }
        });
      } else {
        this.ncrReport = s;
        if (this.ncrReport.ReportProgresses.length > 0) {
          this.getReportProgress(this.ncrReport, progress => {
            this.reportProgresses = progress;
            if (this.reportProgresses.Photo != null)
              this.imgPath.unshift(this.reportPhotoUrl + this.reportProgresses.Photo);
            this.value = progress.Percentage;
            this.limitBottomLine(this.value);
            let slaDuration = this.sla.find(f => f.EnumText === this.ncrReport.SLA);
            let days = moment.duration(moment().add(slaDuration.EnumValue, 'days').diff(this.ncrReport.AssignDate)).asDays();
            if (this.ncrReport.ReportStatus == 4 || this.ncrReport.ReportStatus == 5) {
              days = moment.duration(moment(this.ncrReport.FinishDate).diff(this.ncrReport.AssignDate)).asDays();
            }
            if (days > parseInt(this.sla.find(f => f.EnumText === this.ncrReport.SLA).EnumValue)) {
              this.late = 1
              this.remaining = "Progress already late about " + Math.floor(days) + " days";
            } else {
              this.late = 0;
              this.remaining = "Remaining target " + Math.floor(Math.abs(days)) + " days";
            }
            if (this.ncrReport.ReportStatus == 5 || this.ncrReport.ReportStatus == 4) {
              this.cost = this.ncrReport.TotalCost;
              this.actionNotes = progress.Notes;
              this.delayCause = this.ncrReport.DelayCause;
            }
          });
        } else {
          //blm ada progress
        }
      }
    });
  }

  limitBottomLine(val) {
    this.options = {
      floor: 0,
      ceil: 100,
      showSelectionBar: true,
      showTicks: true,
      tickStep: 20,
      step: 10,
      minLimit: val,
      translate: (value: number): string => {
        return value + "%";
      }
    };
  }

  getReportProgress(Report, callback) {
    this.transact.getReportProgress({ ReportID: Report.Id }).subscribe(resProg => {
      if (resProg.length > 1) {
        callback(resProg.find(f => f.Id == resProg.map(r => r.Id).reduce((prev, current) => (prev.Id > current.Id) ? prev : current)));
      }
      else {
        callback(resProg[0]);
      }
    })
  }

  showAlert(msg: string) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this._location.back()
    });
  }

  bindToObjectHeader(status, notes, callback) {
    this.reportProgresses.Percentage = this.value;
    this.reportProgresses.ReportID = this.ncrReport.Id;
    this.reportProgresses.ProgressStatus = status; //Finish : OnPlay
    this.reportProgresses.Notes = notes;
    this.reportProgresses.Pic = this.ncrReport.Pic;
    callback("mapped");
  }

  bindToObjectDetail(header, notes, callback) {
    this.reportProgressesDetail.CreateBy = this.userRole.Username;
    this.reportProgressesDetail.Start = moment().format('YYYY-MM-DD HH:mm:ss');
    this.reportProgressesDetail.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    this.reportProgressesDetail.ReportProgressID = header.Id;
    this.reportProgressesDetail.Notes = this.actionNotes + ' ' + notes;
    callback("mapped");
  }

  insertHeaderDetail(action, callback) {
    this.bindToObjectHeader(0, this.actionNotes + " " + action, res => {
      if (res === "mapped") {
        this.reportProgresses.CreateBy = this.userRole.Username;
        this.reportProgresses.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        this.transact.postReportProgress(this.reportProgresses).subscribe(header => {
          if (header) {
            //set detail
            this.bindToObjectDetail(header, "New", resdet => {
              if (resdet === "mapped") {
                this.transact.postReportProgressDetail(this.reportProgressesDetail).subscribe(det => {
                  if (det) {
                    this.ncrReport.ReportProgresses.push(header);
                    this.stateService.setNCR(this.ncrReport);
                    callback("done", this.value);
                  }
                });
              }
            })
          }
        });
      }
    });
  }

  onClose() {
    if (parseInt(this.cost.toString())) {
      if (this.late == 1 && this.delayCause == "") {
        this.message = "Please fill delay reason";
        setTimeout(() => {
          this.message = "";
        }, 5000);
        return;
      }
      this.cost = parseInt(this.cost.toString());
      const dialogRefInfo = this._dialog.open<DialogConfirmComponent>(DialogConfirmComponent, {
        data: { Message: "Are you sure to close this NCR?" }
      });
      dialogRefInfo.afterClosed.subscribe((yesNo) => {
        if (yesNo == 1) {
          this.stateService.setBlocking(1);
          this.ncrReport.ReportStatus = 5;
          this.ncrReport.ActionBy = this.userRole.Username;
          this.ncrReport.CloseDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
          this.ncrReport.TotalCost = this.cost;
          this.ncrReport.DelayCause = this.delayCause;
          this.transact.putReport(this.ncrReport).subscribe(d => {
            let notif: PushNotif = new PushNotif;
            notif.Receiver = [...this.qs, this.ncrReport.CreateBy];
            notif.Message = this.ncrReport.Description;
            notif.Title = notif.Message = "Updated " + this.ncrReport.ReportNo + " - " + this.ncrReport.ProjectName;
            notif.Sender = this.userRole.Username;
            this.transact.postPushNotif(notif).subscribe();
            this.showAlert("NCR Report No " + this.ncrReport.ReportNo + " has been closed!");
          })
        }
      });
    } else {
      this.message = "To close, please fill estimation total cost";
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }

  }

  onSubmit() { //Progress Status == 0
    this.ncrReport.ReportStatus = 2;
    this.ncrReport.ActionBy = this.userRole.Username;
    this.transact.putReport(this.ncrReport).subscribe(up => {
      this.stateService.setBlocking(1);
      if (this.ncrReport.ReportProgresses.length == 0) { //no progress
        //set header
        this.insertHeaderDetail("New", (dn, vals) => {
          if (dn == "done") {
            let notif: PushNotif = new PushNotif;
            notif.Receiver = [...this.qs, this.ncrReport.CreateBy];
            notif.Message = this.ncrReport.Description;
            notif.Title = notif.Message = "Updated " + this.ncrReport.ReportNo + " - " + this.ncrReport.ProjectName;
            notif.Sender = this.userRole.Username;
            this.transact.postPushNotif(notif).subscribe();
            this.showAlert("Progress updated " + vals + "%");
          }
        });
      } else {
        this.bindToObjectHeader(0, this.actionNotes, res => {
          if (res === "mapped") {
            this.reportProgresses.UpdateBy = this.userRole.Username;
            this.reportProgresses.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            this.transact.postReportProgress(this.reportProgresses).subscribe(header => {
              if (header) {
                let notif: PushNotif = new PushNotif;
                notif.Receiver = [...this.qs, this.ncrReport.CreateBy];
                notif.Message = this.ncrReport.Description;
                notif.Title = notif.Message = "Updated " + this.ncrReport.ReportNo + " - " + this.ncrReport.ProjectName;
                notif.Sender = this.userRole.Username;
                this.transact.postPushNotif(notif).subscribe();
                this.showAlert("Progress updated " + this.value + "%");
              }
            });
          }
        });
      }
    })

  }

  holdOrFinish(isHold, photo = null, callback) {
    this.bindToObjectHeader(isHold ? 1 : 2, this.actionNotes, res => {
      if (res === "mapped") {
        this.reportProgresses.Photo = photo;
        this.reportProgresses.UpdateBy = this.userRole.Username;
        this.reportProgresses.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        if (this.reportProgresses.CreateDate === '') {
          this.reportProgresses.CreateBy = this.userRole.Username;
          this.reportProgresses.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        }
        this.transact.postReportProgress(this.reportProgresses).subscribe(header => {
          if (header) {
            this.transact.getReportProgressDetail({ ReportProgressID: header.Id, aggr: "max" }).subscribe(det => {
              if (isHold) {
                this.reportProgressesDetail.Pause = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                this.reportProgressesDetail.Notes = this.actionNotes + ' ' + "Hold";
              } else {
                this.reportProgressesDetail.Stop = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                this.reportProgressesDetail.Notes = this.actionNotes + ' ' + "Finish";
              }
              if (det) {
                this.reportProgressesDetail = det[0];
                this.reportProgressesDetail.UpdateBy = this.userRole.Username;
                this.reportProgressesDetail.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                this.transact.putReportProgressDetail(this.reportProgressesDetail).subscribe(det2 => {
                  callback(det2);
                })
              } else {
                this.reportProgressesDetail.ReportProgressID = header.Id;
                this.reportProgressesDetail.Start = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                this.reportProgressesDetail.CreateBy = this.userRole.Username;
                this.reportProgressesDetail.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                this.transact.postReportProgressDetail(this.reportProgressesDetail).subscribe(det2 => {
                  callback(det2);
                })
              }
            })
          }
        });
      }
    });
  }

  onReopen() {
    if (this.actionNotes !== "") {
      this.bindToObjectHeader(0, this.actionNotes + " Reopen", res => {
        if (res === "mapped") {
          this.reportProgresses.Id = 0;
          this.reportProgresses.Photo = null;
          this.reportProgresses.Percentage = 0;
          this.reportProgresses.CreateBy = this.userRole.Username;
          this.reportProgresses.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
          this.transact.postReportProgress(this.reportProgresses).subscribe(header => {
            if (header) {
              //set detail
              this.bindToObjectDetail(header, "Reopen", resdet => {
                if (resdet === "mapped") {
                  this.transact.postReportProgressDetail(this.reportProgressesDetail).subscribe(det => {
                    if (det) {
                      this.ncrReport.ReportProgresses.push(header);
                      this.stateService.setNCR(this.ncrReport);
                      this.ncrReport.ReportStatus = 1;
                      this.ncrReport.ActionBy = this.userRole.Username;
                      this.ncrReport.FinishDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                      this.transact.putReport(this.ncrReport).subscribe(d => {
                        this.showAlert("Report Reopened!");
                      })

                    }
                  });
                }
              })
            }
          });
        }
      });
    } else {
      this.message = "Please give some reason to Re-Open on Action Notes";
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }
  }

  onHold() {
    if (this.actionNotes !== "") {
      this.stateService.setBlocking(1);
      this.holdOrFinish(true, null, res => {
        if (res) {
          this.ncrReport.ReportStatus = 3;
          this.ncrReport.ActionBy = this.userRole.Username;
          this.transact.putReport(this.ncrReport).subscribe(d => {
            let notif: PushNotif = new PushNotif;
            notif.Receiver = [...this.qs, this.ncrReport.CreateBy];
            notif.Message = this.ncrReport.Description;
            notif.Title = notif.Message = "Updated " + this.ncrReport.ReportNo + " - " + this.ncrReport.ProjectName;
            notif.Sender = this.userRole.Username;
            this.transact.postPushNotif(notif).subscribe();
            this.showAlert("Progress Paused!");
          })
        }
      });
    } else {
      this.message = "Please give some reason to Hold on Action Notes";
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }
  }

  onContinue() {
    this.stateService.setBlocking(1);
    this.insertHeaderDetail("Continue", (dn, vals) => {
      if (dn == "done") {
        this.ncrReport.ReportStatus = 2;
        this.ncrReport.ActionBy = this.userRole.Username;
        this.transact.putReport(this.ncrReport).subscribe(d => {
          let notif: PushNotif = new PushNotif;
          notif.Receiver = [...this.qs, this.ncrReport.CreateBy];
          notif.Message = this.ncrReport.Description;
          notif.Title = notif.Message = "Updated " + this.ncrReport.ReportNo + " - " + this.ncrReport.ProjectName;
          notif.Sender = this.userRole.Username;
          this.transact.postPushNotif(notif).subscribe();
          this.showAlert("Progress running again at " + vals + "%");
        })
      }
    });
  }

  onFinish() {
    if (this.imgPath.length == 0) {
      this.message = "Please take a photo as a result";
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
    }
    if (this.actionNotes !== "") {
      let resultUpload = "";
      this.stateService.setBlocking(1);
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
              resultUpload = eventRes.filename;
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
          this.holdOrFinish(false, resultUpload, res => {
            if (res) {
              this.ncrReport.ReportStatus = 4;
              this.ncrReport.ActionBy = this.userRole.Username;
              this.ncrReport.FinishDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
              this.transact.putReport(this.ncrReport).subscribe(d => {
                let notif: PushNotif = new PushNotif;
                notif.Receiver = [...this.qs, this.ncrReport.CreateBy];
                notif.Message = this.ncrReport.Description;
                notif.Title = notif.Message = "Updated " + this.ncrReport.ReportNo + " - " + this.ncrReport.ProjectName;
                notif.Sender = this.userRole.Username;
                this.transact.postPushNotif(notif).subscribe();
                this.showAlert("Progress Finished!");
              })
            }
          });
        } else {
          this.showAlert("Ops, error while uploading photo!");
        }
      });
    } else {
      this.message = "Please give some comment to Finish on Action Notes";
      setTimeout(() => {
        this.message = "";
      }, 5000);
      return;
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

  detachImage(index) {
    this.imgFile.splice(index, 1);
    this.imgPath.splice(index, 1);
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
