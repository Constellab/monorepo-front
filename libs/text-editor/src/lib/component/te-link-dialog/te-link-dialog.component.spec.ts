import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockFlErrorRequiredPipe, MockTranslatePipe } from '../te-test-helpers';
import { TeLinkDialogComponent } from './te-link-dialog.component';

describe('CaTextEditorLinkDialogComponent', () => {
  let component: TeLinkDialogComponent;
  let fixture: ComponentFixture<TeLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeLinkDialogComponent, MockTranslatePipe, MockFlErrorRequiredPipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: '', isYoutube: false } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
