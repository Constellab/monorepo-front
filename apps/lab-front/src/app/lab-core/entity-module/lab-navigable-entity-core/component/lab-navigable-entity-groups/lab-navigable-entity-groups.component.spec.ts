import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNavigableEntityGroupsComponent } from './lab-navigable-entity-groups.component';

describe('LabNavigableEntityGroupsComponent', () => {
  let component: LabNavigableEntityGroupsComponent;
  let fixture: ComponentFixture<LabNavigableEntityGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNavigableEntityGroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNavigableEntityGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
