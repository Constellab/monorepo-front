import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoCommunityTagListItemComponent } from './co-community-tag-list-item.component';

describe('CoCommunityTagListItemComponent', () => {
  let component: CoCommunityTagListItemComponent;
  let fixture: ComponentFixture<CoCommunityTagListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoCommunityTagListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoCommunityTagListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
