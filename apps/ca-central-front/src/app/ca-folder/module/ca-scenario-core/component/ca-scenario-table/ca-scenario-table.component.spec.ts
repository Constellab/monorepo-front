import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioTableComponent } from './ca-scenario-table.component';

describe('CaScenarioTableComponent', () => {
  let component: CaScenarioTableComponent;
  let fixture: ComponentFixture<CaScenarioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaScenarioTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
