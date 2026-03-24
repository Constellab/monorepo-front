import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiCredentialsSearchFormComponent } from './li-credentials-search-form.component';

describe('LiCredentialsSearchFormComponent', () => {
  let component: LiCredentialsSearchFormComponent;
  let fixture: ComponentFixture<LiCredentialsSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiCredentialsSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiCredentialsSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
