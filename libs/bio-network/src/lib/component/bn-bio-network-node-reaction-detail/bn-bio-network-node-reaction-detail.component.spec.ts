import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkNodeReactionDetailComponent} from './bn-bio-network-node-reaction-detail.component';

describe('BnBioNetworkNodeReactionDetailComponent', () => {
  let component: BnBioNetworkNodeReactionDetailComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeReactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkNodeReactionDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkNodeReactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
