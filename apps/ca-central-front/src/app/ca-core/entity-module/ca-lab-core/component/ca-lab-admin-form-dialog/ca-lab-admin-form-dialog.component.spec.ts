import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabAdminFormDialogComponent } from './ca-lab-admin-form-dialog.component';

describe('LabFormDialogComponent', () => {
  let component: CaLabAdminFormDialogComponent;
  let fixture: ComponentFixture<CaLabAdminFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabAdminFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabAdminFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
