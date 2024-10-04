import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioDetailPageComponent } from './ca-scenario-detail-page.component';

describe('ScenarioDetailPageComponent', () => {
  let component: CaScenarioDetailPageComponent;
  let fixture: ComponentFixture<CaScenarioDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaScenarioDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
