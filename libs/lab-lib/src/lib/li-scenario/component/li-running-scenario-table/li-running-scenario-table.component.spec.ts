import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiRunningScenarioTableComponent } from './li-running-scenario-table.component';

describe('LiRunningScenarioTableComponent', () => {
  let component: LiRunningScenarioTableComponent;
  let fixture: ComponentFixture<LiRunningScenarioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiRunningScenarioTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiRunningScenarioTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
