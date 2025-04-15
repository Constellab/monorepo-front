import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTableColumnsTagFilterComponent } from './li-table-columns-tag-filter.component';

describe('LiTableColumnsTagFilterComponent', () => {
  let component: LiTableColumnsTagFilterComponent;
  let fixture: ComponentFixture<LiTableColumnsTagFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTableColumnsTagFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTableColumnsTagFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
