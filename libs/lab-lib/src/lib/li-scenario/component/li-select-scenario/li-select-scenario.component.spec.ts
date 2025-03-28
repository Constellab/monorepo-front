import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectScenarioComponent } from './li-select-scenario.component';

describe('LiSelectScenarioComponent', () => {
  let component: LiSelectScenarioComponent;
  let fixture: ComponentFixture<LiSelectScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectScenarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
