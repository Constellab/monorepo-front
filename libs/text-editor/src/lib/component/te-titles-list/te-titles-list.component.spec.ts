import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TeTitlesListComponent } from './te-titles-list.component';

describe('TeTitlesListComponent', () => {
  let component: TeTitlesListComponent;
  let fixture: ComponentFixture<TeTitlesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTitlesListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTitlesListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('titles', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
