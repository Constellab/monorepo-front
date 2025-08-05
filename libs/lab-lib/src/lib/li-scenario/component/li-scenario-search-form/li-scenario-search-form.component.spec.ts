import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiScenarioSearchFormComponent } from './li-scenario-search-form.component';

describe('LiScenarioAdvancedSearchFormComponent', () => {
  let component: LiScenarioSearchFormComponent;
  let fixture: ComponentFixture<LiScenarioSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioSearchFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiScenarioSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
