import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorVideoComponent} from './ca-text-editor-video.component';

describe('CaTextEditorVideoComponent', () => {
  let component: CaTextEditorVideoComponent;
  let fixture: ComponentFixture<CaTextEditorVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
