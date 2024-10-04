import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTableComponent } from './lab-scenario-table.component';

describe('LabScenarioTableComponent', () => {
  let component: LabScenarioTableComponent;
  let fixture: ComponentFixture<LabScenarioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
