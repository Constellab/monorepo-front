import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabStartStopComponent} from './ca-lab-start-stop.component';

describe('LabStartStopComponent', () => {
  let component: CaLabStartStopComponent;
  let fixture: ComponentFixture<CaLabStartStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabStartStopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabStartStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
