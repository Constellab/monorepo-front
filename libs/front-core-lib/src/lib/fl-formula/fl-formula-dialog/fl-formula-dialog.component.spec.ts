import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlFormulaDialogComponent } from './fl-formula-dialog.component';

describe('TeFormulaDialogComponent', () => {
  let component: FlFormulaDialogComponent;
  let fixture: ComponentFixture<FlFormulaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlFormulaDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlFormulaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
