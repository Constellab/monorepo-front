import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaMailSearchComponent } from './ma-mail-search.component';

describe('MaMailSearchComponent', () => {
  let component: MaMailSearchComponent;
  let fixture: ComponentFixture<MaMailSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaMailSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaMailSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
