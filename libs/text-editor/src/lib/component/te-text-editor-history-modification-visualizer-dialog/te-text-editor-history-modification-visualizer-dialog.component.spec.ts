import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTextEditorHistoryModificationVisualizerDialogComponent } from './te-text-editor-history-modification-visualizer-dialog.component';

describe('TeTextEditorHistoryModificationVisualizerDialogComponent', () => {
  let component: TeTextEditorHistoryModificationVisualizerDialogComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryModificationVisualizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryModificationVisualizerDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryModificationVisualizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
