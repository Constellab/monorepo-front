import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsConfigureLabManagerComponent } from './lms-configure-lab-manager.component';

describe('LmsInitializedLabManagerComponent', () => {
  let component: LmsConfigureLabManagerComponent;
  let fixture: ComponentFixture<LmsConfigureLabManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsConfigureLabManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmsConfigureLabManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
