import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPicComponent } from './dialog-pic.component';

describe('DialogPicComponent', () => {
  let component: DialogPicComponent;
  let fixture: ComponentFixture<DialogPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
