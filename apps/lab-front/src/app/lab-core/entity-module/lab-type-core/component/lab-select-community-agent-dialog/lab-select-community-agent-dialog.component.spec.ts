import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectCommunityAgentDialogComponent } from './lab-select-community-agent-dialog.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LabSelectCommunityAgentDialogComponent;
  let fixture: ComponentFixture<LabSelectCommunityAgentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectCommunityAgentDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectCommunityAgentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
