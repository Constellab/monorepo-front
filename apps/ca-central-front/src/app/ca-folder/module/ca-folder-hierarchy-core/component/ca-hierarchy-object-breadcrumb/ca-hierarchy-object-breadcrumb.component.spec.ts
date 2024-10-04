import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaHierarchyObjectBreadcrumbComponent} from './ca-hierarchy-object-breadcrumb.component';

describe('CaFolderBreadcrumbComponent', () => {
  let component: CaHierarchyObjectBreadcrumbComponent;
  let fixture: ComponentFixture<CaHierarchyObjectBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaHierarchyObjectBreadcrumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
