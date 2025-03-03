import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommunityAppDetailComponent } from './ha-community-app-detail.component';

describe('HaCommunityAppDetailComponent', () => {
  let component: HaCommunityAppDetailComponent;
  let fixture: ComponentFixture<HaCommunityAppDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaCommunityAppDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommunityAppDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
