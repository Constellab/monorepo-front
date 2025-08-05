import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceDetailDialogComponent } from './li-resource-detail-dialog.component';

describe('LabResourceViewDialogComponent', () => {
  let component: LiResourceDetailDialogComponent;
  let fixture: ComponentFixture<LiResourceDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
