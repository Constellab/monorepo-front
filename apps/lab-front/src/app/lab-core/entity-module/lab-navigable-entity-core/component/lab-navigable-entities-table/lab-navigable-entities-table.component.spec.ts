import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNavigableEntitiesTableComponent } from './lab-navigable-entities-table.component';

describe('LabNavigableEntitiesTableComponent', () => {
  let component: LabNavigableEntitiesTableComponent;
  let fixture: ComponentFixture<LabNavigableEntitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNavigableEntitiesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNavigableEntitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
