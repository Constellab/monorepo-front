import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlBrickVersionDetailDialogComponent } from './lml-brick-version-detail-dialog.component';

describe('CaBrickVersionDetailDialogComponent', () => {
  let component: LmlBrickVersionDetailDialogComponent;
  let fixture: ComponentFixture<LmlBrickVersionDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlBrickVersionDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlBrickVersionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
