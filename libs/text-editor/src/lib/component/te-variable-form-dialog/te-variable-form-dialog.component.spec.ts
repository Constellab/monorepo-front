import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeVariableFormDialogComponent } from './te-variable-form-dialog.component';

describe('TeVariableFormComponent', () => {
  let component: TeVariableFormDialogComponent;
  let fixture: ComponentFixture<TeVariableFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeVariableFormDialogComponent, MockTranslatePipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { key: '', value: '', description: '' } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeVariableFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
