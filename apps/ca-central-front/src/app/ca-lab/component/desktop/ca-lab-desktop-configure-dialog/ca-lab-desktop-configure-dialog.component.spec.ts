import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDesktopConfigureDialogComponent } from './ca-lab-desktop-configure-dialog.component';

describe('CaLabDesktopConfigureDialogComponent', () => {
  let component: CaLabDesktopConfigureDialogComponent;
  let fixture: ComponentFixture<CaLabDesktopConfigureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDesktopConfigureDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabDesktopConfigureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
