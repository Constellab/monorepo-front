import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaSpaceLicenseFormDialogComponent} from './ca-space-license-form-dialog.component';

describe('CaSpaceLicenseFormDialogComponent', () => {
  let component: CaSpaceLicenseFormDialogComponent;
  let fixture: ComponentFixture<CaSpaceLicenseFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSpaceLicenseFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSpaceLicenseFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
