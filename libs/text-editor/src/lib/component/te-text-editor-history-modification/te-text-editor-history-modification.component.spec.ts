import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockFlDatePipe, MockTranslatePipe } from '../te-test-helpers';
import { TeTextEditorHistoryModificationComponent } from './te-text-editor-history-modification.component';

describe('TeTextEditorHistoryModificationComponent', () => {
  let component: TeTextEditorHistoryModificationComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryModificationComponent, MockTranslatePipe, MockFlDatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryModificationComponent);
    component = fixture.componentInstance;
    component.modification = { blockId: 'test', type: 'CREATED', userId: 'user-1', user: { id: 'user-1' } } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
