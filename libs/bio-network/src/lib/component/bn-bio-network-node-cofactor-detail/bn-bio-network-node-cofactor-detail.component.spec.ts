import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkNodeCofactorDetailComponent } from './bn-bio-network-node-cofactor-detail.component';

describe('BnBioNetworkNodeCofactorDetailComponent', () => {
  let component: BnBioNetworkNodeCofactorDetailComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeCofactorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkNodeCofactorDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkNodeCofactorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
