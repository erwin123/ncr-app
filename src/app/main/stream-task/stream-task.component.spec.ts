import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamTaskComponent } from './stream-task.component';

describe('StreamTaskComponent', () => {
  let component: StreamTaskComponent;
  let fixture: ComponentFixture<StreamTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
