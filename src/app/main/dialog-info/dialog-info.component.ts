import { Component, OnInit,Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {
  constructor(@Inject(LY_DIALOG_DATA) public data: any,public dialogRefInfo: LyDialogRef) {  }

  ngOnInit() {
    
  }

}
