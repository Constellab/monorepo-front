import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaMailSearchFormComponent } from './ma-mail-search-form.component';

describe('MaMailSearchFormComponent', () => {
  let component: MaMailSearchFormComponent;
  let fixture: ComponentFixture<MaMailSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaMailSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaMailSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
