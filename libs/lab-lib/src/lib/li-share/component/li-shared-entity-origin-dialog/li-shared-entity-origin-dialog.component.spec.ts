import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSharedEntityOriginDialogComponent } from './li-shared-entity-origin-dialog.component';

describe('LabResourceShareOriginDialogComponent', () => {
  let component: LiSharedEntityOriginDialogComponent;
  let fixture: ComponentFixture<LiSharedEntityOriginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSharedEntityOriginDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSharedEntityOriginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
