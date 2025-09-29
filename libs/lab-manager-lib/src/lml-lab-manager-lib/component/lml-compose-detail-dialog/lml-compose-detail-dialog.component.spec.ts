import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LmlComposeDetailDialogComponent } from './lml-compose-detail-dialog.component';

describe('LmlComposeDetailDialogComponent', () => {
  let component: LmlComposeDetailDialogComponent;
  let fixture: ComponentFixture<LmlComposeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlComposeDetailDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            compose: {
              brickName: 'test-brick',
              uniqueName: 'test-unique',
              composeFilePath: '/path/to/compose.yml',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlComposeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
