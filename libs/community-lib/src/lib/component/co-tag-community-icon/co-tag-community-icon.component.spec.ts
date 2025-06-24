import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoTagCommunityIconComponent } from './co-tag-community-icon.component';

describe('CoTagCommunityIconComponent', () => {
  let component: CoTagCommunityIconComponent;
  let fixture: ComponentFixture<CoTagCommunityIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoTagCommunityIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoTagCommunityIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
