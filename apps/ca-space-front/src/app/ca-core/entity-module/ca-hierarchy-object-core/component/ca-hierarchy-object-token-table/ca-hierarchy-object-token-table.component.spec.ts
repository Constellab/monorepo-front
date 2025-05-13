import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTokenTableComponent } from './ca-hierarchy-object-token-table.component';

describe('CaHierarchyObjectTokenTableComponent', () => {
  let component: CaHierarchyObjectTokenTableComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTokenTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectTokenTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTokenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
