import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioTableComponent } from './li-scenario-table.component';

describe('LiScenarioTableComponent', () => {
  let component: LiScenarioTableComponent;
  let fixture: ComponentFixture<LiScenarioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiScenarioTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
