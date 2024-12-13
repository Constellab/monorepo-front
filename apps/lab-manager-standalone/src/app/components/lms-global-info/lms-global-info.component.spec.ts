import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsGlobalInfoComponent } from './lms-global-info.component';

describe('LmsGlobalInfoComponent', () => {
  let component: LmsGlobalInfoComponent;
  let fixture: ComponentFixture<LmsGlobalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsGlobalInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsGlobalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
