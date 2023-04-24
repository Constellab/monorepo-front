import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkConfigComponent} from './bn-bio-network-config.component';

describe('FlPathwayConfigComponent', () => {
  let component: BnBioNetworkConfigComponent;
  let fixture: ComponentFixture<BnBioNetworkConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
