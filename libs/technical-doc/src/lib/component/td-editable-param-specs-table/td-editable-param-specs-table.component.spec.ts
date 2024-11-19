import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdEditableParamSpecsTableComponent } from './td-editable-param-specs-table.component';

describe('TdEditableParamSpecsTableComponent', () => {
  let component: TdEditableParamSpecsTableComponent;
  let fixture: ComponentFixture<TdEditableParamSpecsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdEditableParamSpecsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdEditableParamSpecsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
