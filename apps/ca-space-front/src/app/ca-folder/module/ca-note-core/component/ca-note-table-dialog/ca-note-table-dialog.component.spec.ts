import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteTableDialogComponent } from './ca-note-table-dialog.component';

describe('CaNoteTableDialogComponent', () => {
  let component: CaNoteTableDialogComponent;
  let fixture: ComponentFixture<CaNoteTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaNoteTableDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaNoteTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
