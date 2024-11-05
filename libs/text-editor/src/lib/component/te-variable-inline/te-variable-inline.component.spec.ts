import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeVariableInlineComponent } from './te-variable-inline.component';

describe('TeVariableInlineComponent', () => {
  let component: TeVariableInlineComponent;
  let fixture: ComponentFixture<TeVariableInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeVariableInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeVariableInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
