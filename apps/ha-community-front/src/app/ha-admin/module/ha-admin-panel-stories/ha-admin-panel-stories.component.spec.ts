import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelStoriesComponent } from './ha-admin-panel-stories.component';

describe('HaAdminPanelStoriesComponent', () => {
  let component: HaAdminPanelStoriesComponent;
  let fixture: ComponentFixture<HaAdminPanelStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminPanelStoriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminPanelStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
