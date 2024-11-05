import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkClustersListComponent } from './bn-bio-network-clusters-list.component';

describe('BnBioNetworkClustersListComponent', () => {
  let component: BnBioNetworkClustersListComponent;
  let fixture: ComponentFixture<BnBioNetworkClustersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnBioNetworkClustersListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnBioNetworkClustersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
