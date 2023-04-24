import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnBioNetworkReactionContentComponent } from './bn-bio-network-reaction-content.component';

describe('BnBioNetworkReactionContentComponent', () => {
  let component: BnBioNetworkReactionContentComponent;
  let fixture: ComponentFixture<BnBioNetworkReactionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnBioNetworkReactionContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnBioNetworkReactionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
