import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioIconsComponent } from './lab-scenario-icons.component';

describe('LabScenarioIconsComponent', () => {
  let component: LabScenarioIconsComponent;
  let fixture: ComponentFixture<LabScenarioIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabScenarioIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
