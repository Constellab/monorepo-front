import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { of } from 'rxjs';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeTextEditorHistoryPortalComponent } from './te-text-editor-history-portal.component';

describe('TeTextEditorHistoryPortalComponent', () => {
  let component: TeTextEditorHistoryPortalComponent;
  let fixture: ComponentFixture<TeTextEditorHistoryPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorHistoryPortalComponent, MockTranslatePipe],
      providers: [
        {
          provide: FL_PORTAL_DATA,
          useValue: {
            entityId: 'test-id',
            service: { getHistory: () => of([]) },
            textEditorConfig: {},
            isEditable: false,
          },
        },
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorHistoryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
