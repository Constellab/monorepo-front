import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsConfigureLabManagerDialogComponent } from './lms-configure-lab-manager-dialog.component';

describe('LmsConfigureLabManagerDialogComponent', () => {
  let component: LmsConfigureLabManagerDialogComponent;
  let fixture: ComponentFixture<LmsConfigureLabManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsConfigureLabManagerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsConfigureLabManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
