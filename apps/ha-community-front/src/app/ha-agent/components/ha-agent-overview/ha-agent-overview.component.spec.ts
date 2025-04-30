import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaAgentOverviewComponent } from './ha-agent-overview.component';

describe('HaAgentOverviewComponent', () => {
  let component: HaAgentOverviewComponent;
  let fixture: ComponentFixture<HaAgentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAgentOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAgentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
