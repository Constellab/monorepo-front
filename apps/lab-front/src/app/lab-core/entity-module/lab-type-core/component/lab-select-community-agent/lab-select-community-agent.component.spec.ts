import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectCommunityAgentComponent } from './lab-select-community-agent.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LabSelectCommunityAgentComponent;
  let fixture: ComponentFixture<LabSelectCommunityAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabSelectCommunityAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectCommunityAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
