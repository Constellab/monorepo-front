import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiShareLinkLinksComponent } from './li-share-link-links.component';

describe('LiShareLinkLinksComponent', () => {
  let component: LiShareLinkLinksComponent;
  let fixture: ComponentFixture<LiShareLinkLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiShareLinkLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiShareLinkLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
