import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaMailContentDialogComponent } from './ma-mail-content-dialog.component';

describe('MaMailContentDialogComponent', () => {
  let component: MaMailContentDialogComponent;
  let fixture: ComponentFixture<MaMailContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaMailContentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaMailContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
