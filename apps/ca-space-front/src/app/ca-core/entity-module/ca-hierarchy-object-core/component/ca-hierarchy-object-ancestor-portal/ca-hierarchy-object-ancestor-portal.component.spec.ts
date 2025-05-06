import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectAncestorPortalComponent } from './ca-hierarchy-object-ancestor-portal.component';

describe('CaHierarchyObjectAncestorPortalComponent', () => {
  let component: CaHierarchyObjectAncestorPortalComponent;
  let fixture: ComponentFixture<CaHierarchyObjectAncestorPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectAncestorPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectAncestorPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
