import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaMailErrorDialogComponent } from './ma-mail-error-dialog.component';

describe('MaMailErrorDialogComponent', () => {
  let component: MaMailErrorDialogComponent;
  let fixture: ComponentFixture<MaMailErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaMailErrorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaMailErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
