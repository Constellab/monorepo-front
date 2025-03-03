import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommunityAppPageComponent } from './ha-community-app-page.component';

describe('HaCommunityAppPageComponent', () => {
  let component: HaCommunityAppPageComponent;
  let fixture: ComponentFixture<HaCommunityAppPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaCommunityAppPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommunityAppPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
