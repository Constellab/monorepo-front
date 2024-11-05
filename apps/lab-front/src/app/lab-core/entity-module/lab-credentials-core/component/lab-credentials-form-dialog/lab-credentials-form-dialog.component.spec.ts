import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCredentialsFormDialogComponent } from './lab-credentials-form-dialog.component';

describe('LabCredentialsFormDialogComponent', () => {
  let component: LabCredentialsFormDialogComponent;
  let fixture: ComponentFixture<LabCredentialsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabCredentialsFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabCredentialsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
