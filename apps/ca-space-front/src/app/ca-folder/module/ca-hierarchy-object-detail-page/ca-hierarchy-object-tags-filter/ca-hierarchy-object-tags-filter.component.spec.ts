import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTagsFilterComponent } from './ca-hierarchy-object-tags-filter.component';

describe('CaHierarchyObjectTagsFilterComponent', () => {
  let component: CaHierarchyObjectTagsFilterComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTagsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectTagsFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTagsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
