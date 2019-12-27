import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { TransactService } from 'src/app/services/transact.service';
import * as SecureLS from 'secure-ls';
import { FormControl } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';

const STYLES = ({
  item: {
    padding: '0px',
    height: '100%'
  },
  itemKpi: {
    padding: '5px 5px 0px 5px',
    height: '100%'
  },
  itemDdl: {
    padding: '0px 2px 0px 2px'
  }
});
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  sourceReports = [];
  reportBar = [];
  reportPieRootCause = [];
  reportPieScope = [];
  reportCost = [];
  reportDelay = [];
  ddlProject = [];
  ddlYear = [];
  userRole;
  userRules;
  ls = new SecureLS();
  selectedProject;
  selectFormControl = new FormControl('');
  isDirty = false;
  projects = [];
  constructor(private transact: TransactService, private theme: LyTheme2, private excelService: ExcelService) {
    this.userRole = this.ls.get("user");
    this.userRules = this.ls.get("rules").filter(f => f.Ui === "stream-ticket");
    this.projects = this.ls.get("project");
  }

  ngOnInit() {
    let criteria;
    let eachProject = this.projects[0];
    switch (this.userRole.Role) {
      case "qs":
        criteria = {}
        break;
      case "qs-pr":
        criteria = { ProjectID: eachProject.Id }
        break;
      case "pic":
        criteria = { Pic: this.userRole.Username }
        break;
      case "user":
        criteria = { CreateBy: this.userRole.Username }
        break;
    }
    this.transact.getReporting(criteria).subscribe(res => {
      this.sourceReports = res;
      this.setDataBar(res);
      this.setDataPieRootCause(res);
      this.setDataPieScope(res);
      this.setDdlProject(res);
      this.setDdlYear(res);
      this.setDataCost(res);
      this.setDataDelay(res);
    });

    this.selectFormControl.valueChanges.subscribe(p => {
      if (p) {
        this.setDataBar(p);
        this.setDataPieRootCause(p);
        this.setDataPieScope(p);
        this.setDataCost(p);
        this.setDataDelay(p);
        this.isDirty = true;
      }
    })
  }

  setDdlProject(data) {
    this.ddlProject = this.groupFunc(data, "ProjectName").map(a => {
      return {
        "name": a.key,
        "value": a.value
      }
    });
  }

  exportExcel() {
    this.excelService.exportAsExcelFile(this.sourceReports, "export_raw_" + new Date().toISOString().split('T')[0] + "_");
  }

  setDdlYear(data) {
    this.ddlYear = this.groupFunc(data, "Year").map(a => {
      return {
        "name": a.key,
        "value": a.value
      }
    });
  }

  setDataBar(data) {
    this.reportBar = this.groupFunc(data, "ReportStatus").map(a => {
      return {
        "name": a.key,
        "value": a.value
      }
    });
    this.reportBar.map(d => {
      d["series"] = this.groupFunc(d.value, "EnumProp").map(b => {
        return {
          "name": b.key,
          "value": b.value.length
        }
      })
    });
  }

  setDataPieRootCause(data) {
    this.reportPieRootCause = this.groupFunc(data, "RootCause").map(a => {
      return {
        "name": a.key,
        "value": a.value.length
      }
    });
  }

  setDataPieScope(data) {
    this.reportPieScope = this.groupFunc(data, "Scope").map(a => {
      return {
        "name": a.key,
        "value": a.value.length
      }
    });
  }

  setDataCost(data) {
    this.reportCost = this.groupFunc(data, "ProjectName").map(a => {
      return {
        "name": a.key,
        "value": a.value
      }
    });
    this.reportCost.map(d => {
      d["series"] = this.groupFunc(d.value, "MonthName").map(b => {
        return {
          "name": b.key,
          "value": b.value.map(res => parseInt(res.TotalCost)).reduce((c, d) => c + d)
        }
      })
    });
  }

  setDataDelay(data) {
    this.reportDelay = this.groupFunc(data, "ProjectName").map(a => {
      return {
        "name": a.key,
        "value": a.value
      }
    });
    this.reportDelay.map(d => {
      d["series"] = this.groupFunc(d.value, "MonthName").map(b => {
        return {
          "name": b.key,
          "value": b.value.filter(f => f.Late == 1).length
        }
      })
    });
  }

  groupFunc(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }

  kpiClick(item) {
    this.selectFormControl.setValue('');
    this.setDataBar(item.value);
    this.setDataPieRootCause(item.value);
    this.setDataPieScope(item.value);
    this.setDdlProject(item.value);
    this.setDdlYear(item.value);
    this.setDataCost(item.value);
    this.setDataDelay(item.value);
    this.isDirty = true;
  }

  clearFilter() {
    this.selectFormControl.setValue('');
    this.setDataBar(this.sourceReports);
    this.setDataPieRootCause(this.sourceReports);
    this.setDataPieScope(this.sourceReports);
    this.setDdlProject(this.sourceReports);
    this.setDdlYear(this.sourceReports);
    this.setDataCost(this.sourceReports);
    this.setDataDelay(this.sourceReports);
    this.isDirty = false;
  }
}
