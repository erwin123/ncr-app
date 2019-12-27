import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TransactService } from 'src/app/services/transact.service';
import { StateService } from 'src/app/services/state.service';
import { LyTheme2 } from '@alyle/ui';
import * as SecureLS from 'secure-ls';
import { SwPush } from '@angular/service-worker';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';
const styles = () => ({
  item: {
    padding: '5px 5px 0px 5px',
    height: '100%'
  },
  itemSmall: {
    padding: '0px 0px 0px 10px',
    height: '100%'
  }
});

@Component({
  selector: 'app-stream-task',
  templateUrl: './stream-task.component.html',
  styleUrls: ['./stream-task.component.scss']
})
export class StreamTaskComponent implements OnInit, AfterViewInit {
  readonly classes = this.theme.addStyleSheet(styles);
  myReports = [];
  sourceReports = [];
  config: any;
  ls = new SecureLS();
  userRules: any;
  userRole: any;
  loader = true;
  deviceInfo = null;
  sla;
  deviceType = 0; //0: mobile, 1:desktop, 2:tablet
  lateFilter = false;
  searchFilter = "";
  projects=[];
  readonly VAPID_PUBLIC_KEY = "BKNBVSiQL0_ncDMju-7aVRrr9U98jhOzGsukMF097iPgajXf9CE9YshsHIycCQfRBtk_lpJ5w_vTlAsD1rRmYdE";

  constructor(private deviceService: DeviceDetectorService, private swPush: SwPush,
    private transact: TransactService, private theme: LyTheme2, private stateService: StateService) {

    this.userRole = this.ls.get("user");
    console.log(this.userRole);
    this.userRules = this.ls.get("rules").filter(f => f.Ui === "stream-ticket");
    this.deviceInfo = this.ls.get("deviceInfo");
    this.sla = this.ls.get("enums");
    this.projects = this.ls.get("project");
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.stateService.currentScrollPosition.subscribe(sc => {
        if (sc > 0) {
          document.getElementById("main-el").scrollTop = sc;
        }
      })
    }, 800);
  }
  ngOnInit() {
    if (!this.deviceInfo) {
      this.deviceInfo = this.deviceService.getDeviceInfo();
      this.ls.set("deviceInfo", this.deviceInfo);
    }
    this.deviceType = this.deviceService.isMobile() ? 0 : (this.deviceService.isDesktop() ? 1 : 2);

    this.stateService.currentBulkNcrFiltered.subscribe(s => {
      if (s) {
        this.myReports = s;
        this.loader = false;
        this.stateService.currentBulkNcr.subscribe(o => {
          this.sourceReports = o;
        });

      } else {
        this.fetchData(res => {
          this.sourceReports = res;
          this.stateService.setBulkNcr(res);
          this.myReports = res;
          this.loader = false;
        })
      }

    })

    this.transact.getPushNotif({ Username: this.userRole.Username, DeviceType: this.deviceType }).subscribe(res => {
      if (res.length == 0) {
        this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
        }).then(sub => {
          console.log(sub);
          this.transact.postPushData({
            RowStatus: 1,
            PushData: [...[], sub],
            Username: this.userRole.Username,
            DeviceType: this.deviceType,
            CreateBy: this.userRole.Username,
            CreateDate: moment().format('YYYY-MM-DD HH:mm:ss')
          }).subscribe()
        })
          .catch(err => console.error("Could not subscribe to notifications", err));
      }
    })
    this.stateService.setTitle("Feed");
  }

  fetchData(callback) {
    let criteria;
    let eachProject = this.projects[0];
    switch (this.userRole.Role) {
      case "qs":
        criteria = {}
        break;
      case "qs-pr":
        criteria = { ProjectID : eachProject.Id}
        break;
      case "pic":
        criteria = { Op: "OR", Prop: [{ Pic: this.userRole.Username }, { CreateBy: this.userRole.Username }] }
        break;
      case "user":
        criteria = { CreateBy: this.userRole.Username }
        break;
    }
    this.transact.getReport(criteria).subscribe(res => {
      res.map(m => {
        m["ProjectType"] = m.Project.ProjectType;
        let days = moment.duration(moment().diff(m.AssignDate)).asDays();
        if (m.ReportStatus == 4 || m.ReportStatus == 5) {
          days = moment.duration(moment(m.FinishDate).diff(m.AssignDate)).asDays();
        }
        m["Late"] = m.SLA && days > parseInt(this.sla.find(f => f.EnumText === m.SLA).EnumValue) ? 1 : 0;
        m["Overdue"] = m.SLA && days > parseInt(this.sla.find(f => f.EnumText === m.SLA).EnumValue) ? Math.floor(days) : 0;
        m["ProjectName"] = m.Project.ProjectName;
        return m;
      });
      callback(res);
    });

    this
  }
  ngOnDestroy() {
    this.stateService.setBulkNcrFiltered(this.myReports);
    this.stateService.setScrollPosition(document.getElementById("main-el").scrollTop);
  }

  kpiClick(item) {
    this.myReports = item.value;
  }

  clearFilter() {
    this.myReports = this.sourceReports;
    this.lateFilter = false;
    this.searchFilter = "";
  }

  chkLate($event) {
    if ($event.checked) {
      this.lateFilter = true;
      this.myReports = this.myReports.filter(f => f.Late == 1);
    } else {
      this.myReports = this.sourceReports;
      this.lateFilter = false;
      this.searchFilter = "";
    }
  }

  onSearchChange($event) {
    this.myReports = this.sourceReports.filter(
      item => item.ReportNo.toLowerCase().indexOf($event.toLowerCase()) > -1 ||
        item.ProjectName.toLowerCase().indexOf($event.toLowerCase()) > -1
    )
  }
}
