import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeEditBlockMetadataDialogComponent } from './te-edit-block-metadata-dialog.component';

describe('TeEditBlockMetadataDialogComponent', () => {
  let component: TeEditBlockMetadataDialogComponent;
  let fixture: ComponentFixture<TeEditBlockMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeEditBlockMetadataDialogComponent, MockTranslatePipe],
      imports: [MatAutocompleteModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { metadataList: [], currentMetadata: {} } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeEditBlockMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
