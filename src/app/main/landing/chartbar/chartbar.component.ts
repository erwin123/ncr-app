import { Component, OnInit, Input } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  item: {
    padding: '0px',
    height: '100%'
  }
});

@Component({
  selector: 'app-chartbar',
  templateUrl: './chartbar.component.html',
  styleUrls: ['./chartbar.component.scss']
})
export class ChartbarComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  @Input() title: string;
  @Input() showLegend: boolean;
  @Input() data: any;

  month: string[];
  branch: string[];
  year: string;
  view = [400,200];
  loader = true;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showXAxisLabel = false;
  xAxisLabel = '';
  showYAxisLabel = false;
  yAxisLabel = '';

  colorScheme = {
    domain: ['#00876c',
      '#a8ba61',
      '#e8ff38',
      '#e18745',
      '#d43d51']
  };
  constructor(private theme: LyTheme2) {
  }

  ngOnInit() {
    
  }

  onSelect(event) {
    console.log(event);
  }
}
