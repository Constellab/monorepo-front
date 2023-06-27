import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabActivitySearchFormComponent} from './lab-activity-search-form.component';

describe('LabActivitySearchFormComponent', () => {
  let component: LabActivitySearchFormComponent;
  let fixture: ComponentFixture<LabActivitySearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabActivitySearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabActivitySearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
