import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabFreeAdminFormDialogComponent } from './ca-lab-free-admin-form-dialog.component';

describe('CaLabConstestFormDialogComponent', () => {
  let component: CaLabFreeAdminFormDialogComponent;
  let fixture: ComponentFixture<CaLabFreeAdminFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeAdminFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabFreeAdminFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
