import { Component, OnInit, Input } from '@angular/core';
import { NcrReport } from 'src/app/model';
import { LyTheme2 } from '@alyle/ui';
import { InitialService } from 'src/app/services/initial.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
const styles = () => ({
  item: {
    padding: '10px',
    height: '100%'
  },
  cardType: {
    padding: '14px',
    fontSize: '1.5rem',
    color: '#213071'
  },
  cardStatus: {
    padding: '13.5px 4px 13.5px 4px',
    fontSize: '14px',
    color: '#fff',
    textAlign: 'center'
  },
  cardSubStatus: {
    fontSize: '10px',
    fontStyle: 'italic'
  },
  cardTitle: {
    padding: '14px',
    marginLeft: '5px',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  cardSubTitle: {
    fontSize: '0.6rem',
    fontStyle: 'italic',
    color: '#999'
  }
});
@Component({
  selector: 'app-stream-card',
  templateUrl: './stream-card.component.html',
  styleUrls: ['./stream-card.component.scss']
})
export class StreamCardComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(styles);
  @Input("rpt") rpt: NcrReport;
  @Input("userRules") userRules;
  @Input("userRole") userRole;
  reportPhotoUrl = "";
  reportNoPhotoUrl = "";
  config: any;
  value = 0;
  constructor(private theme: LyTheme2, private initial: InitialService,
    private router: Router, private stateService: StateService) {
    this.config = this.initial.getConfig();
  }

  ngOnInit() {
    this.reportPhotoUrl = this.config.Api.global_attachment;
    this.reportNoPhotoUrl = this.config.Api.global_img + "no-pic.jpg";
    if (this.rpt.ReportProgresses.length>0) {
      let collProgress = this.rpt.ReportProgresses;
      this.value=collProgress.find(f => f.Id == collProgress.map(r => r.Id).reduce((prev, current) => (prev.Id > current.Id) ? prev : current)).Percentage;
    }
  }

  onMyRule(ruleName) {
    return this.userRules.map(f => f.RuleName).indexOf(ruleName);
  }

  printBastk(Id) {
    window.open(this.config.Api.global_api + "/report/bastk/" + Id.toString(), "_blank");
  }

  viewTicket(reportId) {
    this.stateService.setNCR(this.rpt);
    switch (this.rpt.Project.ProjectType) {
      case "BUILDING":
        this.router.navigate(['main/trans/building/1'],
          {
            queryParams: {
              rpt: reportId,
              mode: this.rpt.CreateBy === this.userRole.Username && this.rpt.ReportStatus == 0 ? 2 : 1
            }
          });
        break;
      case "INFRA":
        this.router.navigate(['main/trans/infra/2'],
          {
            queryParams: {
              rpt: reportId,
              mode: this.rpt.CreateBy === this.userRole.Username && this.rpt.ReportStatus == 0 ? 2 : 1
            }
          });
        break;
      case "FOUNDATION":
        this.router.navigate(['main/trans/foundation/3'],
          {
            queryParams:
            {
              rpt: reportId,
              mode: this.rpt.CreateBy === this.userRole.Username && this.rpt.ReportStatus == 0 ? 2 : 1
            }
          });
        break;
    }
  }
}
