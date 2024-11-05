import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaUserUpdateLicenseFormDialogComponent } from './ca-user-update-license-form-dialog.component';

describe('CaUserUpdateLicenseFormDialogComponent', () => {
  let component: CaUserUpdateLicenseFormDialogComponent;
  let fixture: ComponentFixture<CaUserUpdateLicenseFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaUserUpdateLicenseFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaUserUpdateLicenseFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
