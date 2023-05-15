import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabResourceDefaultViewComponent} from './lab-resource-default-view.component';

describe('LabResourceDefaultViewComponent', () => {
  let component: LabResourceDefaultViewComponent;
  let fixture: ComponentFixture<LabResourceDefaultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceDefaultViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceDefaultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
