import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaHierarchyObjectTokensDialogComponent } from './ca-hierarchy-object-tokens-dialog.component';

describe('CaHierarchyObjectTokensDialogComponent', () => {
  let component: CaHierarchyObjectTokensDialogComponent;
  let fixture: ComponentFixture<CaHierarchyObjectTokensDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaHierarchyObjectTokensDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaHierarchyObjectTokensDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
