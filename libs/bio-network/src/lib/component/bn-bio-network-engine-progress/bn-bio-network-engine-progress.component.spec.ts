import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkEngineProgressComponent } from './bn-bio-network-engine-progress.component';

describe('BnBioNetworkEngineProgressComponent', () => {
  let component: BnBioNetworkEngineProgressComponent;
  let fixture: ComponentFixture<BnBioNetworkEngineProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkEngineProgressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkEngineProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
