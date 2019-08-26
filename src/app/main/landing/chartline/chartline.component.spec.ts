import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartlineComponent } from './chartline.component';

describe('ChartlineComponent', () => {
  let component: ChartlineComponent;
  let fixture: ComponentFixture<ChartlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
