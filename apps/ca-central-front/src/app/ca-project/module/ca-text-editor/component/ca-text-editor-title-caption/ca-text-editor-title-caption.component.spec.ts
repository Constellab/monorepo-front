import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorTitleCaptionComponent} from './ca-text-editor-title-caption.component';

describe('CaTextEditorTitleCaptionComponent', () => {
  let component: CaTextEditorTitleCaptionComponent;
  let fixture: ComponentFixture<CaTextEditorTitleCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorTitleCaptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorTitleCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
