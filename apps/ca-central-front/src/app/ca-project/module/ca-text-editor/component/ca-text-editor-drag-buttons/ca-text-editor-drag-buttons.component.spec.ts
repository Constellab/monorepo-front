import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorDragButtonsComponent} from './ca-text-editor-drag-buttons.component';

describe('FlTextEditorDragButtonsComponent', () => {
  let component: CaTextEditorDragButtonsComponent;
  let fixture: ComponentFixture<CaTextEditorDragButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorDragButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorDragButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
