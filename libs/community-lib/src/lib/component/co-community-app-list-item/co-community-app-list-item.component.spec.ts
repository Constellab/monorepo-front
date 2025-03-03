import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoCommunityAppListItemComponent } from './co-community-app-list-item.component';

describe('CoCommunityAppListItemComponent', () => {
  let component: CoCommunityAppListItemComponent;
  let fixture: ComponentFixture<CoCommunityAppListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoCommunityAppListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoCommunityAppListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
