import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaListBricksPageComponent } from './ha-list-bricks-page.component';

describe('DaPublicListBricksPageComponent', () => {
  let component: HaListBricksPageComponent;
  let fixture: ComponentFixture<HaListBricksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaListBricksPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaListBricksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
