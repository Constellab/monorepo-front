import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioStatusOptionsComponent } from './li-scenario-status-options.component';

describe('LiScenarioStatusOptionsComponent', () => {
  let component: LiScenarioStatusOptionsComponent;
  let fixture: ComponentFixture<LiScenarioStatusOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioStatusOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiScenarioStatusOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
