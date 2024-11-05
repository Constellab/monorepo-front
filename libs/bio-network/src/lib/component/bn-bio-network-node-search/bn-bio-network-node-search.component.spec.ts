import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkNodeSearchComponent } from './bn-bio-network-node-search.component';

describe('BnBioNetworkNodeSearchComponent', () => {
  let component: BnBioNetworkNodeSearchComponent;
  let fixture: ComponentFixture<BnBioNetworkNodeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkNodeSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkNodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
