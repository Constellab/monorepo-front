import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentVersionDetailComponent } from './ha-agent-version-detail.component';

describe('HaAgentVersionDetailComponent', () => {
  let component: HaAgentVersionDetailComponent;
  let fixture: ComponentFixture<HaAgentVersionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaAgentVersionDetailComponent],
    });
    fixture = TestBed.createComponent(HaAgentVersionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
