import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaTeamSearchComponent } from './ca-team-search.component';

describe('CaTeamSearchComponent', () => {
  let component: CaTeamSearchComponent;
  let fixture: ComponentFixture<CaTeamSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaTeamSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaTeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
