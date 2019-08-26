import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTicketComponent } from './base-ticket.component';

describe('BaseTicketComponent', () => {
  let component: BaseTicketComponent;
  let fixture: ComponentFixture<BaseTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
