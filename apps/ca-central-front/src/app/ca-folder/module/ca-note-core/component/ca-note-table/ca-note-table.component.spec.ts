import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteTableComponent } from './ca-note-table.component';

describe('CaNoteTableComponent', () => {
  let component: CaNoteTableComponent;
  let fixture: ComponentFixture<CaNoteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaNoteTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaNoteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
