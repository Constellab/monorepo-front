import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommunityAppComponent } from './ha-community-app.component';

describe('HaCommunityAppComponent', () => {
  let component: HaCommunityAppComponent;
  let fixture: ComponentFixture<HaCommunityAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaCommunityAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommunityAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
