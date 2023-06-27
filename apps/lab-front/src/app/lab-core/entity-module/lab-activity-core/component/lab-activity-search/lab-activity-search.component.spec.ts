import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabActivitySearchComponent} from './lab-activity-search.component';

describe('LabActivitySearchComponent', () => {
  let component: LabActivitySearchComponent;
  let fixture: ComponentFixture<LabActivitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabActivitySearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabActivitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
