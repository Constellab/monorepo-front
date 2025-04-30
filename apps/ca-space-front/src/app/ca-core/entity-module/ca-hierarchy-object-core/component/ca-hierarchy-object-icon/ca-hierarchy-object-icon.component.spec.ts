import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectIconComponent } from './ca-hierarchy-object-icon.component';

describe('CaFolderIconComponent', () => {
  let component: CaHierarchyObjectIconComponent;
  let fixture: ComponentFixture<CaHierarchyObjectIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
