import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlErrorDetailComponent } from '../../../../../../../../../../../../../tools/ll-error-detail.component';

describe('ErrorDetailComponent', () => {
  let component: LlErrorDetailComponent;
  let fixture: ComponentFixture<LlErrorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LlErrorDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LlErrorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
