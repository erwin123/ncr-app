import { Component, OnInit, Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  Message:string = "";
  constructor(@Inject(LY_DIALOG_DATA) public data: any, public dialogRefConfirm: LyDialogRef) { }

  ngOnInit() {
    this.Message = this.data.Message;
  }

  onYes($event) {
    this.dialogRefConfirm.close(1);
  }
}
