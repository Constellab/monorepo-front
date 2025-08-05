import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiCredentialsInlineComponent } from './li-credentials-inline.component';

describe('LiCredentialsInlineComponent', () => {
  let component: LiCredentialsInlineComponent;
  let fixture: ComponentFixture<LiCredentialsInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiCredentialsInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiCredentialsInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
