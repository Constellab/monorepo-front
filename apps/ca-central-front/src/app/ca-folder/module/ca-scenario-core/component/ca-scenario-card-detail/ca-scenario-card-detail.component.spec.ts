import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioCardDetailComponent } from './ca-scenario-card-detail.component';

describe('ScenarioCardDetailComponent', () => {
  let component: CaScenarioCardDetailComponent;
  let fixture: ComponentFixture<CaScenarioCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioCardDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
