import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectActionsMenuComponent } from './ca-hierarchy-object-actions-menu.component';

describe('CaFolderActionMenuComponent', () => {
  let component: CaHierarchyObjectActionsMenuComponent;
  let fixture: ComponentFixture<CaHierarchyObjectActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectActionsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
