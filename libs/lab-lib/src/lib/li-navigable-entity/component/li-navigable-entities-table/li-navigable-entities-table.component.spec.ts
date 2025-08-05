import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNavigableEntitiesTableComponent } from './li-navigable-entities-table.component';

describe('LiNavigableEntitiesTableComponent', () => {
  let component: LiNavigableEntitiesTableComponent;
  let fixture: ComponentFixture<LiNavigableEntitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNavigableEntitiesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNavigableEntitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
