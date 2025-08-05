import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceViewDetailDialogComponent } from './li-resource-view-detail-dialog.component';

describe('LiResourceViewDetailDialogComponent', () => {
  let component: LiResourceViewDetailDialogComponent;
  let fixture: ComponentFixture<LiResourceViewDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewDetailDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceViewDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
