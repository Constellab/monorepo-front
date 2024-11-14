import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaMailTableComponent } from './ma-mail-table.component';

describe('MaMailTableComponent', () => {
  let component: MaMailTableComponent;
  let fixture: ComponentFixture<MaMailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaMailTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaMailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
