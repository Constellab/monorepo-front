import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTypeSearchFormComponent } from './lab-type-search-form.component';

describe('LabTypeAdvancedSearchFormComponent', () => {
  let component: LabTypeSearchFormComponent;
  let fixture: ComponentFixture<LabTypeSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTypeSearchFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTypeSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
