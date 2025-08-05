import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTypeSearchFormComponent } from './li-type-search-form.component';

describe('LabTypeAdvancedSearchFormComponent', () => {
  let component: LiTypeSearchFormComponent;
  let fixture: ComponentFixture<LiTypeSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTypeSearchFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTypeSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
