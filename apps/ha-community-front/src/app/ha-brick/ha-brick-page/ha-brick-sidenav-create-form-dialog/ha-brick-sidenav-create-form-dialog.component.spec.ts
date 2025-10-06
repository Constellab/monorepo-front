import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickSidenavCreateFormDialogComponent } from './ha-brick-sidenav-create-form-dialog.component';

describe('HaPublicSidenavFormDialogComponent', () => {
  let component: HaBrickSidenavCreateFormDialogComponent;
  let fixture: ComponentFixture<HaBrickSidenavCreateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickSidenavCreateFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickSidenavCreateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
