import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioSearchComponent } from './li-scenario-search.component';

describe('BioxScenarioSearchComponent', () => {
  let component: LiScenarioSearchComponent;
  let fixture: ComponentFixture<LiScenarioSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiScenarioSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
