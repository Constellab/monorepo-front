import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSharedEntityInfoDialogComponent } from './li-shared-entity-info-dialog.component';

describe('LiSharedEntityInfoDialogComponent', () => {
  let component: LiSharedEntityInfoDialogComponent;
  let fixture: ComponentFixture<LiSharedEntityInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSharedEntityInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSharedEntityInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
