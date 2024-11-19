import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdConfigureParamSpecsTableDialogComponent } from './td-configure-param-specs-table-dialog.component';

describe('TdConfigureParamSpecsTableDialogComponent', () => {
  let component: TdConfigureParamSpecsTableDialogComponent;
  let fixture: ComponentFixture<TdConfigureParamSpecsTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdConfigureParamSpecsTableDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdConfigureParamSpecsTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
