import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkReactionDetailComponent } from './bn-bio-network-reaction-detail.component';

describe('BnBioNetworkReactionDetailComponent', () => {
  let component: BnBioNetworkReactionDetailComponent;
  let fixture: ComponentFixture<BnBioNetworkReactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkReactionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkReactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
