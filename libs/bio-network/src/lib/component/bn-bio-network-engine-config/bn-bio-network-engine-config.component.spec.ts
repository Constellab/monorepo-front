import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkEngineConfigComponent} from './bn-bio-network-engine-config.component';

describe('BnBioNetworkEngineConfigComponent', () => {
  let component: BnBioNetworkEngineConfigComponent;
  let fixture: ComponentFixture<BnBioNetworkEngineConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkEngineConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkEngineConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
