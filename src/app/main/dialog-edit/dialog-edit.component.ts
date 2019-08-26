import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent implements OnInit, AfterViewInit {
  @ViewChild("myDraw") child: any;
  @ViewChild('parentCanvas') elementView: ElementRef;
  imageUrl = "";
  maxWidthCanvas = 0;
  editMode=false;

  resultImg: any;
  constructor(@Inject(LY_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer, public dialogRef: LyDialogRef) { }

  ngOnInit() {
    this.imageUrl = this.data.image;
    this.editMode = this.data.editMode;
  }
  ngAfterViewInit() {
    this.maxWidthCanvas = this.elementView.nativeElement.offsetWidth;
  }
  onSave($event) {
    var reader = new FileReader();
    reader.readAsDataURL($event);
    reader.onloadend = ()=> {
      let base64data = reader.result;
      this.dialogRef.close(base64data);
    }
  }

  close() {
    this.dialogRef.close(false);
  }

}
