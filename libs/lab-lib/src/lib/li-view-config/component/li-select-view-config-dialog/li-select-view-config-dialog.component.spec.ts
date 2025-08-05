import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectViewConfigDialogComponent } from './li-select-view-config-dialog.component';

describe('LiSelectViewConfigDialogComponent', () => {
  let component: LiSelectViewConfigDialogComponent;
  let fixture: ComponentFixture<LiSelectViewConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectViewConfigDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectViewConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
