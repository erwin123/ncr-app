import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDrawingComponent } from './image-drawing.component';

describe('ImageDrawingComponent', () => {
  let component: ImageDrawingComponent;
  let fixture: ComponentFixture<ImageDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
