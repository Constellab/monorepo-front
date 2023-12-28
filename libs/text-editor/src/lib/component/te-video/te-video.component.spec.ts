import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeVideoComponent} from './te-video.component';

describe('FlTextEditorVideoComponent', () => {
  let component: TeVideoComponent;
  let fixture: ComponentFixture<TeVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
