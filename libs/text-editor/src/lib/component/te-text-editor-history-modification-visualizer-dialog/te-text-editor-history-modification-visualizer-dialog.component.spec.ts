import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { of } from 'rxjs';

import { MockFlDatePipe, MockTranslatePipe } from '../te-test-helpers';
import { TeTextEditorHistoryModificationVisualizerDialogComponent } from './te-text-editor-history-modification-visualizer-dialog.component';

describe('TeTextEditorHistoryModificationVisualizerDialogComponent', () => {
  let component: TeTextEditorHistoryModificationVisualizerDialogComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryModificationVisualizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryModificationVisualizerDialogComponent, MockTranslatePipe, MockFlDatePipe],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            textEditorConfig: { uiConfig: { dense: false } },
            service: { getPreviousVersion: () => of({}) },
            entityId: 'test-id',
            clickEventData: {
              group: { mainModificationId: () => 'mod-1', modifications: [] },
              users: [],
            },
            users: [],
            isEditable: false,
          },
        },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryModificationVisualizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
