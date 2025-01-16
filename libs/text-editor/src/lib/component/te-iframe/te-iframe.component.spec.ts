import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeIframeComponent } from './te-iframe.component';

describe('TeFormulaComponent', () => {
  let component: TeIframeComponent;
  let fixture: ComponentFixture<TeIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeIframeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
