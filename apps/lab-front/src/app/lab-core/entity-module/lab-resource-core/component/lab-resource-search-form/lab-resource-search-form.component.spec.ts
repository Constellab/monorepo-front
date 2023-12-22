import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabResourceSearchFormComponent} from './lab-resource-search-form.component';

describe('BioxResourceAdvancedSearchFormComponent', () => {
  let component: LabResourceSearchFormComponent;
  let fixture: ComponentFixture<LabResourceSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabResourceSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabResourceSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
