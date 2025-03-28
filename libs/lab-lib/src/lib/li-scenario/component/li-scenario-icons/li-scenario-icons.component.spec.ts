import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioIconsComponent } from './li-scenario-icons.component';

describe('LiScenarioIconsComponent', () => {
  let component: LiScenarioIconsComponent;
  let fixture: ComponentFixture<LiScenarioIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioIconsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
