import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTokenFormDialogComponent } from './ca-hierarchy-object-token-form-dialog.component';

describe('CaHierarchyObjectTokenDialogFormComponent', () => {
  let component: CaHierarchyObjectTokenFormDialogComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTokenFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectTokenFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTokenFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
