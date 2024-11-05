import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkComponent } from './bn-bio-network.component';

describe('BnBioNetworkTwoComponent', () => {
  let component: BnBioNetworkComponent;
  let fixture: ComponentFixture<BnBioNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
