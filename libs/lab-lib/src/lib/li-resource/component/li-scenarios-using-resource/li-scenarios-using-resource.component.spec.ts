import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiScenariosUsingResourceComponent } from './li-scenarios-using-resource.component';

describe('LabResourcesUsedInScenarioComponent', () => {
  let component: LiScenariosUsingResourceComponent;
  let fixture: ComponentFixture<LiScenariosUsingResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenariosUsingResourceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenariosUsingResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
