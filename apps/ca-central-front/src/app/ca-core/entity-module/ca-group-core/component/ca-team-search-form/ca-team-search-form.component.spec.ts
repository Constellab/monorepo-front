import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTeamSearchFormComponent} from './ca-team-search-form.component';

describe('CaTeamSearchFormComponent', () => {
  let component: CaTeamSearchFormComponent;
  let fixture: ComponentFixture<CaTeamSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaTeamSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaTeamSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
