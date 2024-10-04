import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteCardComponent } from './ca-note-card.component';

describe('NoteCardComponent', () => {
  let component: CaNoteCardComponent;
  let fixture: ComponentFixture<CaNoteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaNoteCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaNoteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
