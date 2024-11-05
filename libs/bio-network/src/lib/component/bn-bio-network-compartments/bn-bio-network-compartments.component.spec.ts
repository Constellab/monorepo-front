import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkCompartmentsComponent } from './bn-bio-network-compartments.component';

describe('BnBioNetworkCompartmentsComponent', () => {
  let component: BnBioNetworkCompartmentsComponent;
  let fixture: ComponentFixture<BnBioNetworkCompartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkCompartmentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkCompartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
