import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNotesListComponent } from './ca-notes-list.component';

describe('CaNoteListComponent', () => {
  let component: CaNotesListComponent;
  let fixture: ComponentFixture<CaNotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaNotesListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
