import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTagsDialogComponent } from './ca-hierarchy-object-tags-dialog.component';

describe('CaHierarchyObjectTagsDialogComponent', () => {
  let component: CaHierarchyObjectTagsDialogComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTagsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectTagsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
