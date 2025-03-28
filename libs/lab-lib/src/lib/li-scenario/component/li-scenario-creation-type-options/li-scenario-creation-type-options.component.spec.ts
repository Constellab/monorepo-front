import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioCreationTypeOptionsComponent } from './li-scenario-creation-type-options.component';

describe('BioxScenarioTypeOptionsComponent', () => {
  let component: LiScenarioCreationTypeOptionsComponent;
  let fixture: ComponentFixture<LiScenarioCreationTypeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioCreationTypeOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiScenarioCreationTypeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
