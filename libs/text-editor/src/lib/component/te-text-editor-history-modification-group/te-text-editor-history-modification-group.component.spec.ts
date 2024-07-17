import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTextEditorHistoryModificationGroupComponent } from './te-text-editor-history-modification-group.component';

describe('TeTextEditorHistoryModificationGroupComponent', () => {
  let component: TeTextEditorHistoryModificationGroupComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryModificationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryModificationGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryModificationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
