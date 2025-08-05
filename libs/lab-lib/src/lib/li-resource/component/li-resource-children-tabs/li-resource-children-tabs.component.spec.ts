import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceChildrenTabsComponent } from './li-resource-children-tabs.component';

describe('LiResourceChildrenTabsComponent', () => {
  let component: LiResourceChildrenTabsComponent;
  let fixture: ComponentFixture<LiResourceChildrenTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceChildrenTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceChildrenTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
