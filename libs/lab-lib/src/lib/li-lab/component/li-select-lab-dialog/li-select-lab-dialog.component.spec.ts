import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectLabDialogComponent } from './li-select-lab-dialog.component';

describe('LiSelectLabDialogComponent', () => {
  let component: LiSelectLabDialogComponent;
  let fixture: ComponentFixture<LiSelectLabDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectLabDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectLabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
