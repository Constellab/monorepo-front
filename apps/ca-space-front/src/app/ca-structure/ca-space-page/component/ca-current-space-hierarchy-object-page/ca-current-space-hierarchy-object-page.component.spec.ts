import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCurrentSpaceHierarchyObjectPageComponent } from './ca-current-space-hierarchy-object-page.component';

describe('CaCurrentSpaceCaFoldersPageComponent', () => {
  let component: CaCurrentSpaceHierarchyObjectPageComponent;
  let fixture: ComponentFixture<CaCurrentSpaceHierarchyObjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceHierarchyObjectPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceHierarchyObjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
