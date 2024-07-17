import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTextEditorHistoryModificationComponent } from './ha-text-editor-history-modification.component';

describe('HaTextEditorHistoryModificationComponent', () => {
  let component: HaTextEditorHistoryModificationComponent;
  let fixture: ComponentFixture<HaTextEditorHistoryModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaTextEditorHistoryModificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaTextEditorHistoryModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
