import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabActivityTableComponent} from './lab-activity-table.component';

describe('LabActivityTableComponent', () => {
  let component: LabActivityTableComponent;
  let fixture: ComponentFixture<LabActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabActivityTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
