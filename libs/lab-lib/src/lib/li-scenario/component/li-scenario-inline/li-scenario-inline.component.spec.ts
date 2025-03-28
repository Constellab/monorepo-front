import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioInlineComponent } from './li-scenario-inline.component';

describe('LiScenarioInlineComponent', () => {
  let component: LiScenarioInlineComponent;
  let fixture: ComponentFixture<LiScenarioInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
