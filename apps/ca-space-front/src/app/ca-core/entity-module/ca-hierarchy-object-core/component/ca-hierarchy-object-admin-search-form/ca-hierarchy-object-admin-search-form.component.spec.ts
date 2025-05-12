import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectAdminSearchFormComponent } from './ca-hierarchy-object-admin-search-form.component';

describe('CaHierarchyObjectAdminSearchFormComponent', () => {
  let component: CaHierarchyObjectAdminSearchFormComponent;
  let fixture: ComponentFixture<CaHierarchyObjectAdminSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectAdminSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectAdminSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
