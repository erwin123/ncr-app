import { Component, OnInit, Input } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  item: {
    padding: '0px',
    height: '100%'
  }
});
@Component({
  selector: 'app-chartpie',
  templateUrl: './chartpie.component.html',
  styleUrls: ['./chartpie.component.scss']
})
export class ChartpieComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  @Input() title: string;
  @Input() showLegend: boolean;
  @Input() data: any;
  @Input() maxWidth: any;
  @Input() height: any;
  @Input() isAdvanced: number;

  month: string[];
  branch: string[];
  year: string;

  view = [350, 210];
  loader = true;
  // options
  gradient = false;
  doughnut = true;
  showLabels = true;
  explodeSlices = false;
  colorScheme = {
    domain: ['#00876c',
      '#a8ba61',
      '#e8ff38',
      '#e18745',
      '#d43d51',
      '#625799']
  };
  constructor(private theme: LyTheme2) {
  }
  ngOnInit() {
  }

}
