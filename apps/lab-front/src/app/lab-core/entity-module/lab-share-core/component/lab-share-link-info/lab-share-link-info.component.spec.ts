import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabShareLinkInfoComponent } from './lab-share-link-info.component';

describe('ShareLinkValidityComponent', () => {
  let component: LabShareLinkInfoComponent;
  let fixture: ComponentFixture<LabShareLinkInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabShareLinkInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabShareLinkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
