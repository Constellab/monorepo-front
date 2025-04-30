import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectInlineComponent } from './ca-hierarchy-object-inline.component';

describe('CaFolderInlineComponent', () => {
  let component: CaHierarchyObjectInlineComponent;
  let fixture: ComponentFixture<CaHierarchyObjectInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
