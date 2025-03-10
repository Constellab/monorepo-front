import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommunityAppListPageComponent } from './ha-community-app-list-page.component';

describe('HaCommunityAppListPageComponent', () => {
  let component: HaCommunityAppListPageComponent;
  let fixture: ComponentFixture<HaCommunityAppListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaCommunityAppListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommunityAppListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
