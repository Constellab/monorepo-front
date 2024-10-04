import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTreeComponent } from './ca-hierarchy-object-tree.component';

describe('CaHierarchyObjectTree2Component', () => {
  let component: CaHierarchyObjectTreeComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
