import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceActionsMenuComponent } from './li-resource-actions-menu.component';

describe('LiResourceActionsMenuComponent', () => {
  let component: LiResourceActionsMenuComponent;
  let fixture: ComponentFixture<LiResourceActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceActionsMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
