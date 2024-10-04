import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenariosUsingResourceComponent } from './lab-scenarios-using-resource.component';

describe('LabResourcesUsedInScenarioComponent', () => {
  let component: LabScenariosUsingResourceComponent;
  let fixture: ComponentFixture<LabScenariosUsingResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenariosUsingResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabScenariosUsingResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
