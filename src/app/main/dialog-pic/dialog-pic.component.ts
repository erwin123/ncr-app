import { Component, OnInit, Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';

@Component({
  selector: 'app-dialog-pic',
  templateUrl: './dialog-pic.component.html',
  styleUrls: ['./dialog-pic.component.scss']
})
export class DialogPicComponent implements OnInit {
  picChoosed;
  current;
  listPic=[];
  constructor(@Inject(LY_DIALOG_DATA) public data: any, public dialogRefPic: LyDialogRef) { }

  ngOnInit() {
    this.listPic = this.data.Pics;
    this.current = this.data.Current;
    this.picChoosed = this.data.Pics.find(f=>f.Username === this.data.Current);
  }

  onSave($event) {
    this.dialogRefPic.close(this.picChoosed);
  }
}
