import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceViewPortalComponent } from './li-resource-view-portal.component';

describe('LiResourceViewPortalComponent', () => {
  let component: LiResourceViewPortalComponent;
  let fixture: ComponentFixture<LiResourceViewPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewPortalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceViewPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
