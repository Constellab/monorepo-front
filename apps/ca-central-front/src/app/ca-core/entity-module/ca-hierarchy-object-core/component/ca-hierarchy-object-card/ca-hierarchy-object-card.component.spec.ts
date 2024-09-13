import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectCardComponent } from './ca-hierarchy-object-card.component';

describe('CaFolderCardComponent', () => {
  let component: CaHierarchyObjectCardComponent;
  let fixture: ComponentFixture<CaHierarchyObjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaHierarchyObjectCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
