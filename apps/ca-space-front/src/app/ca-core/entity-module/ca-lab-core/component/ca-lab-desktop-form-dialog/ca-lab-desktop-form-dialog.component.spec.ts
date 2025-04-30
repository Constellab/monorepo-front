import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDesktopFormDialogComponent } from './ca-lab-desktop-form-dialog.component';

describe('CaLabDesktopFormDialogComponent', () => {
  let component: CaLabDesktopFormDialogComponent;
  let fixture: ComponentFixture<CaLabDesktopFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDesktopFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabDesktopFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
