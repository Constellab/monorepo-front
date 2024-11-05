import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeFilesListComponent } from './te-files-list.component';

describe('TeFilesListComponent', () => {
  let component: TeFilesListComponent;
  let fixture: ComponentFixture<TeFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFilesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
