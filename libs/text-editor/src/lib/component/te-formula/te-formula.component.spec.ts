import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TeFormulaComponent} from './te-formula.component';

describe('TeFormulaComponent', () => {
  let component: TeFormulaComponent;
  let fixture: ComponentFixture<TeFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFormulaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
