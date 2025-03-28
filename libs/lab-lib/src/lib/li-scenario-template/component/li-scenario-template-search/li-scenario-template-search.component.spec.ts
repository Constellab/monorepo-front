import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioTemplateSearchComponent } from './li-scenario-template-search.component';

describe('LiScenarioTemplateSearchComponent', () => {
  let component: LiScenarioTemplateSearchComponent;
  let fixture: ComponentFixture<LiScenarioTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
