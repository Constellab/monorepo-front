import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkNodeDetailComponent } from './bn-bio-network-node-detail.component';

describe('FlChartPathwayNodeDetailComponent', () => {
  let component: BnBioNetworkNodeDetailComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkNodeDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkNodeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
