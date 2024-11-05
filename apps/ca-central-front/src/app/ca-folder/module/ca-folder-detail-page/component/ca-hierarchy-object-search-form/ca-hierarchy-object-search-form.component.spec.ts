import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectSearchFormComponent } from './ca-hierarchy-object-search-form.component';

describe('CaHierarchyObjectSearchFormComponent', () => {
  let component: CaHierarchyObjectSearchFormComponent;
  let fixture: ComponentFixture<CaHierarchyObjectSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
