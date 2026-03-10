import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TeCodeComponent } from './te-code.component';

describe('TeCodeComponent', () => {
  let component: TeCodeComponent;
  let fixture: ComponentFixture<TeCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeCodeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeCodeComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl<string>('');
    component.language = 'javascript' as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
