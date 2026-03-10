import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeTimestampConfigDialogComponent } from './te-timestamp-config-dialog.component';

describe('TeTimestampConfigDialogComponent', () => {
  let component: TeTimestampConfigDialogComponent;
  let fixture: ComponentFixture<TeTimestampConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTimestampConfigDialogComponent, MockTranslatePipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { format: 'DATE_TIME' } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTimestampConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
