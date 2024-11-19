import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdEditParamSpecDialogComponent } from './td-edit-param-spec-dialog.component';

describe('TdEditParamSpecDialogComponent', () => {
  let component: TdEditParamSpecDialogComponent;
  let fixture: ComponentFixture<TdEditParamSpecDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdEditParamSpecDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdEditParamSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
