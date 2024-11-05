import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeFigureComponent } from './te-figure.component';

describe('CaTextEditorFigureComponent', () => {
  let component: TeFigureComponent;
  let fixture: ComponentFixture<TeFigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFigureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
