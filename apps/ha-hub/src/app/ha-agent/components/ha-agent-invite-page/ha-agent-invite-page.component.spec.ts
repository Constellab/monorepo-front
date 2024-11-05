import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentInvitePageComponent } from './ha-agent-invite-page.component';

describe('HaStoryInvitePageComponent', () => {
  let component: HaAgentInvitePageComponent;
  let fixture: ComponentFixture<HaAgentInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAgentInvitePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAgentInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
