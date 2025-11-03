import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaMyAppsPageComponent } from './ca-my-apps-page.component';

describe('CaMyAppsPageComponent', () => {
  let component: CaMyAppsPageComponent;
  let fixture: ComponentFixture<CaMyAppsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaMyAppsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaMyAppsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
