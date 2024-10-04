import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioInfoComponent } from './ca-scenario-info.component';

describe('ScenarioInfoComponent', () => {
  let component: CaScenarioInfoComponent;
  let fixture: ComponentFixture<CaScenarioInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaScenarioInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
