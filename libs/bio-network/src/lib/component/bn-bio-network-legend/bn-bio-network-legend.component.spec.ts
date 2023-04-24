import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkLegendComponent} from './bn-bio-network-legend.component';

describe('BnBioNetworkLegendComponent', () => {
  let component: BnBioNetworkLegendComponent;
  let fixture: ComponentFixture<BnBioNetworkLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkLegendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
