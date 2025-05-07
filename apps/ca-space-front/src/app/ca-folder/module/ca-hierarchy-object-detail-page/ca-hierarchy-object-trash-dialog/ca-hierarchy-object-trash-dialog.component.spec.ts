import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTrashDialogComponent } from './ca-hierarchy-object-trash-dialog.component';

describe('CaHierarchyObjectTrashDialogComponent', () => {
  let component: CaHierarchyObjectTrashDialogComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTrashDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectTrashDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTrashDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
