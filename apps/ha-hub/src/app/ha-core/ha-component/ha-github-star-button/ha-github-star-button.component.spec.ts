import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaGithubStarButtonComponent } from './ha-github-star-button.component';

describe('HaGithubStarButtonComponent', () => {
  let component: HaGithubStarButtonComponent;
  let fixture: ComponentFixture<HaGithubStarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaGithubStarButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaGithubStarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
