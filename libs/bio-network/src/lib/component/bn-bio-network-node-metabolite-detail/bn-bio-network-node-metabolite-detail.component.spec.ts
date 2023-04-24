import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkNodeMetaboliteDetailComponent} from './bn-bio-network-node-metabolite-detail.component';

describe('BnBioNetworkMetaboliteNodeDetailComponent', () => {
  let component: BnBioNetworkNodeMetaboliteDetailComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeMetaboliteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkNodeMetaboliteDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkNodeMetaboliteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
