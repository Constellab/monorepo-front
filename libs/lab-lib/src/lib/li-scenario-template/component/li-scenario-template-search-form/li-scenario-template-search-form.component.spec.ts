import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiScenarioTemplateSearchFormComponent } from './li-scenario-template-search-form.component';

describe('LiScenarioTemplateSearchFormComponent', () => {
  let component: LiScenarioTemplateSearchFormComponent;
  let fixture: ComponentFixture<LiScenarioTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
