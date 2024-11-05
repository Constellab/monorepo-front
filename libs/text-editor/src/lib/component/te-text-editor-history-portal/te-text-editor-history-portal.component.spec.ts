import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTextEditorHistoryPortalComponent } from './te-text-editor-history-portal.component';

describe('TeTextEditorHistoryPortalComponent', () => {
  let component: TeTextEditorHistoryPortalComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
