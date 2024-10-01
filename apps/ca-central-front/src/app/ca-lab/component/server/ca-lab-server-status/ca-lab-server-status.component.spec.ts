import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabServerStatusComponent} from './ca-lab-server-status.component';

describe('CaLabServerStatusComponent', () => {
  let component: CaLabServerStatusComponent;
  let fixture: ComponentFixture<CaLabServerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabServerStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabServerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
