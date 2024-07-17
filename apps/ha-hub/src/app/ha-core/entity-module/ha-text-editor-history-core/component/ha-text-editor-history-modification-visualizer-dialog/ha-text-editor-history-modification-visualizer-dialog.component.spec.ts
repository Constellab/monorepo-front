import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTextEditorHistoryModificationVisualizerDialogComponent } from './ha-text-editor-history-modification-visualizer-dialog.component';

describe('HaTextEditorHistoryModificationVisualizerDialogComponent', () => {
  let component: HaTextEditorHistoryModificationVisualizerDialogComponent;
  let fixture: ComponentFixture<HaTextEditorHistoryModificationVisualizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaTextEditorHistoryModificationVisualizerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaTextEditorHistoryModificationVisualizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
