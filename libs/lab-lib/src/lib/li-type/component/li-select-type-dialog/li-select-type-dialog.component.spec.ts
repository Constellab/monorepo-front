import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectTypeDialogComponent } from './li-select-type-dialog.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LiSelectTypeDialogComponent;
  let fixture: ComponentFixture<LiSelectTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectTypeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
