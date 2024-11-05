import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlFormulaStandaloneComponent } from './fl-formula-standalone.component';

describe('FlFormulaStandaloneComponent', () => {
  let component: FlFormulaStandaloneComponent;
  let fixture: ComponentFixture<FlFormulaStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlFormulaStandaloneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlFormulaStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
