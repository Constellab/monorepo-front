import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkMetaboliteDetailComponent} from './bn-bio-network-metabolite-detail.component';

describe('BnBioNetworkMetaboliteDetailComponent', () => {
  let component: BnBioNetworkMetaboliteDetailComponent;
  let fixture: ComponentFixture<BnBioNetworkMetaboliteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkMetaboliteDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkMetaboliteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
