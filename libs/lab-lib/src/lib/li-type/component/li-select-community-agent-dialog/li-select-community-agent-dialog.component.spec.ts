import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectCommunityAgentDialogComponent } from './li-select-community-agent-dialog.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LiSelectCommunityAgentDialogComponent;
  let fixture: ComponentFixture<LiSelectCommunityAgentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectCommunityAgentDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectCommunityAgentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
