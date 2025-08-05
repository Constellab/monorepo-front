import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiShareLinkInfoComponent } from './li-share-link-info.component';

describe('ShareLinkValidityComponent', () => {
  let component: LiShareLinkInfoComponent;
  let fixture: ComponentFixture<LiShareLinkInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiShareLinkInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiShareLinkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
