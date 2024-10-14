import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentVersionPageComponent } from './ha-agent-version-page.component';

describe('HaAgentVersionPageComponent', () => {
  let component: HaAgentVersionPageComponent;
  let fixture: ComponentFixture<HaAgentVersionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaAgentVersionPageComponent]
    });
    fixture = TestBed.createComponent(HaAgentVersionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
