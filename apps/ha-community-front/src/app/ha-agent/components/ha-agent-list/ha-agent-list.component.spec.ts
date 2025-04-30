import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentListComponent } from './ha-agent-list.component';

describe('HaAgentListComponent', () => {
  let component: HaAgentListComponent;
  let fixture: ComponentFixture<HaAgentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaAgentListComponent],
    });
    fixture = TestBed.createComponent(HaAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
