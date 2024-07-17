import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTextEditorHistoryModificationGroupComponent } from './ha-text-editor-history-modification-group.component';

describe('HaTextEditorHistoryModificationGroupComponent', () => {
  let component: HaTextEditorHistoryModificationGroupComponent;
  let fixture: ComponentFixture<HaTextEditorHistoryModificationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaTextEditorHistoryModificationGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaTextEditorHistoryModificationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
