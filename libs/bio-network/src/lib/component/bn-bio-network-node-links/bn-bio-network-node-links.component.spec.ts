import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkNodeLinksComponent } from './bn-bio-network-node-links.component';

describe('FlChartPathwayNodeLinksComponent', () => {
  let component: BnBioNetworkNodeLinksComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkNodeLinksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkNodeLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
