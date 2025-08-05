import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectScenarioDynamicFieldComponent } from './li-select-scenario-dynamic-field.component';

describe('LiSelectScenarioDynamicFieldComponent', () => {
  let component: LiSelectScenarioDynamicFieldComponent;
  let fixture: ComponentFixture<LiSelectScenarioDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectScenarioDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectScenarioDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
