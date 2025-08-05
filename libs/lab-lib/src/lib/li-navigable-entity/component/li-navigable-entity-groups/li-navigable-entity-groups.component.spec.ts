import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNavigableEntityGroupsComponent } from './li-navigable-entity-groups.component';

describe('LiNavigableEntityGroupsComponent', () => {
  let component: LiNavigableEntityGroupsComponent;
  let fixture: ComponentFixture<LiNavigableEntityGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNavigableEntityGroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNavigableEntityGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
