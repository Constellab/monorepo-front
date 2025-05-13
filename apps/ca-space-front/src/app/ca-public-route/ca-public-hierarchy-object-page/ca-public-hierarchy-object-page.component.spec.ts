import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaPublicHierarchyObjectPageComponent } from './ca-public-hierarchy-object-page.component';

describe('CaPublicHierarchyObjectPageComponent', () => {
  let component: CaPublicHierarchyObjectPageComponent;
  let fixture: ComponentFixture<CaPublicHierarchyObjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaPublicHierarchyObjectPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaPublicHierarchyObjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
