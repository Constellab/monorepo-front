import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabUserFormDialogComponent } from './ca-lab-user-form-dialog.component';

describe('LabUserFormDialogComponent', () => {
  let component: CaLabUserFormDialogComponent;
  let fixture: ComponentFixture<CaLabUserFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabUserFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabUserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
