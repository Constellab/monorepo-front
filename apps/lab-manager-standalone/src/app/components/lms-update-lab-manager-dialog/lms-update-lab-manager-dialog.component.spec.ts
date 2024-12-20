import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsUpdateLabManagerDialogComponent } from './lms-update-lab-manager-dialog.component';

describe('LmsUpdateLabManagerDialogComponent', () => {
  let component: LmsUpdateLabManagerDialogComponent;
  let fixture: ComponentFixture<LmsUpdateLabManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsUpdateLabManagerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsUpdateLabManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
