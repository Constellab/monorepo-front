import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectCommunityAgentComponent } from './li-select-community-agent.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LiSelectCommunityAgentComponent;
  let fixture: ComponentFixture<LiSelectCommunityAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectCommunityAgentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectCommunityAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
