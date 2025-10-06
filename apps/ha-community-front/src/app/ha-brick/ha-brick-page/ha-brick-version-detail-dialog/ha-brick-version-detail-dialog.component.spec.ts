import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickVersionDetailDialogComponent } from './ha-brick-version-detail-dialog.component';

describe('HaPublicBrickVersionDetailDialogComponent', () => {
  let component: HaBrickVersionDetailDialogComponent;
  let fixture: ComponentFixture<HaBrickVersionDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickVersionDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickVersionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
