import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTableComponent } from './ca-hierarchy-object-table.component';

describe('CaFolderTableComponent', () => {
  let component: CaHierarchyObjectTableComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
