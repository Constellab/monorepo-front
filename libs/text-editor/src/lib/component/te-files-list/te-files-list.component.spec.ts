import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TeFilesListComponent } from './te-files-list.component';

describe('TeFilesListComponent', () => {
  let component: TeFilesListComponent;
  let fixture: ComponentFixture<TeFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFilesListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeFilesListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('files', []);
    fixture.componentRef.setInput('urlToDownloadPrefix', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
