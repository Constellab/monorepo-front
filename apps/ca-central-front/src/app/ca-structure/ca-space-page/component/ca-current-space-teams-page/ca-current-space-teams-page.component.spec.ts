import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaCurrentSpaceTeamsPageComponent} from './ca-current-space-teams-page.component';

describe('CaCurrentSpaceTeamsPageComponent', () => {
  let component: CaCurrentSpaceTeamsPageComponent;
  let fixture: ComponentFixture<CaCurrentSpaceTeamsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceTeamsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceTeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
