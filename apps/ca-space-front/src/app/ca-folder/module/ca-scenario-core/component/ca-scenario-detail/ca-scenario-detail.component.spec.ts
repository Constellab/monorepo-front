import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioDetailComponent } from './ca-scenario-detail.component';

describe('CaScenarioDetailComponent', () => {
  let component: CaScenarioDetailComponent;
  let fixture: ComponentFixture<CaScenarioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaScenarioDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaScenarioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
