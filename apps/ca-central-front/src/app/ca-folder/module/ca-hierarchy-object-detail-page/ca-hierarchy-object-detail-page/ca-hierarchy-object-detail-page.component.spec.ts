import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectDetailPageComponent } from './ca-hierarchy-object-detail-page.component';

describe('CaFolderObjectLayoutComponent', () => {
  let component: CaHierarchyObjectDetailPageComponent;
  let fixture: ComponentFixture<CaHierarchyObjectDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
