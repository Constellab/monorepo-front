import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNotesUsingResourceComponent } from './lab-notes-using-resource.component';

describe('LabNotesUsingResourceComponent', () => {
  let component: LabNotesUsingResourceComponent;
  let fixture: ComponentFixture<LabNotesUsingResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNotesUsingResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabNotesUsingResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
