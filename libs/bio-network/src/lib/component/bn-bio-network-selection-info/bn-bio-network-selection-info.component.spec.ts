import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkSelectionInfoComponent } from './bn-bio-network-selection-info.component';

describe('BnBioNetworkSelectionInfoComponent', () => {
  let component: BnBioNetworkSelectionInfoComponent;
  let fixture: ComponentFixture<BnBioNetworkSelectionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkSelectionInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkSelectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
