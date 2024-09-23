import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteDetailComponent } from './ca-note-detail.component';

describe('CaNoteDetailComponent', () => {
  let component: CaNoteDetailComponent;
  let fixture: ComponentFixture<CaNoteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaNoteDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaNoteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
