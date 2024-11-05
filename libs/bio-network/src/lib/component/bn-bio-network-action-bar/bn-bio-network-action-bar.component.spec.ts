import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkActionBarComponent } from './bn-bio-network-action-bar.component';

describe('BnBioNetworkActionBarComponent', () => {
  let component: BnBioNetworkActionBarComponent;
  let fixture: ComponentFixture<BnBioNetworkActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkActionBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
