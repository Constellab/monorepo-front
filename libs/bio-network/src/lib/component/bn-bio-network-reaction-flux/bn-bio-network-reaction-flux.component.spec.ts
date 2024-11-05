import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkReactionFluxComponent } from './bn-bio-network-reaction-flux.component';

describe('BnBioNetworkReactionFluxComponent', () => {
  let component: BnBioNetworkReactionFluxComponent;
  let fixture: ComponentFixture<BnBioNetworkReactionFluxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkReactionFluxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkReactionFluxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
