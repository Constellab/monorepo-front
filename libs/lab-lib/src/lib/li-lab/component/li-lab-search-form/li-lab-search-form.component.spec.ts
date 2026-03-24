import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLabSearchFormComponent } from './li-lab-search-form.component';

describe('LiLabSearchFormComponent', () => {
  let component: LiLabSearchFormComponent;
  let fixture: ComponentFixture<LiLabSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLabSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLabSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
