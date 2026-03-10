import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockFlDatePipe, MockTranslatePipe } from '../te-test-helpers';
import { TeTextEditorHistoryModificationGroupComponent } from './te-text-editor-history-modification-group.component';

describe('TeTextEditorHistoryModificationGroupComponent', () => {
  let component: TeTextEditorHistoryModificationGroupComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryModificationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryModificationGroupComponent, MockTranslatePipe, MockFlDatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryModificationGroupComponent);
    component = fixture.componentInstance;
    component.group = { modifications: [], time: null } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
