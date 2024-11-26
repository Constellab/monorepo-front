import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabShareLinkLinksComponent } from './lab-share-link-links.component';

describe('LabShareLinkLinksComponent', () => {
  let component: LabShareLinkLinksComponent;
  let fixture: ComponentFixture<LabShareLinkLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabShareLinkLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabShareLinkLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
