import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeFormulaInlineComponent } from './te-formula-inline.component';

describe('TeFormulaInlineComponent', () => {
  let component: TeFormulaInlineComponent;
  let fixture: ComponentFixture<TeFormulaInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeFormulaInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeFormulaInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
