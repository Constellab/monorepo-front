import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentPageComponent } from './ha-agent-page.component';

describe('HaAgentPageComponent', () => {
  let component: HaAgentPageComponent;
  let fixture: ComponentFixture<HaAgentPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaAgentPageComponent],
    });
    fixture = TestBed.createComponent(HaAgentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
