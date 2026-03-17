import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiCredentialsSearchComponent } from './li-credentials-search.component';

describe('LiCredentialsSearchComponent', () => {
  let component: LiCredentialsSearchComponent;
  let fixture: ComponentFixture<LiCredentialsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiCredentialsSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiCredentialsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
