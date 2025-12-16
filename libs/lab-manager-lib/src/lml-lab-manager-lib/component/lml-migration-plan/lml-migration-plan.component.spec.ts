import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlMigrationPlanComponent } from './lml-migration-plan.component';

describe('LmlMigrationPlanComponent', () => {
  let component: LmlMigrationPlanComponent;
  let fixture: ComponentFixture<LmlMigrationPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlMigrationPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlMigrationPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
