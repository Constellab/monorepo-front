import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkDrawerComponent } from './bn-bio-network-drawer.component';

describe('FlPathwayDrawerActionComponent', () => {
  let component: BnBioNetworkDrawerComponent;
  let fixture: ComponentFixture<BnBioNetworkDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkDrawerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
