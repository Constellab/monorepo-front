import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteInfoDialogComponent } from './ca-note-info-dialog.component';

describe('CaNoteInfoDialogComponent', () => {
  let component: CaNoteInfoDialogComponent;
  let fixture: ComponentFixture<CaNoteInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaNoteInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaNoteInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
