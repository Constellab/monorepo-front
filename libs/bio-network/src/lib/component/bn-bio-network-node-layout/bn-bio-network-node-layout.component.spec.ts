import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BnBioNetworkNodeLayoutComponent} from './bn-bio-network-node-layout.component';

describe('BnBioNetworkNodeSaveComponent', () => {
  let component: BnBioNetworkNodeLayoutComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkNodeLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkNodeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
