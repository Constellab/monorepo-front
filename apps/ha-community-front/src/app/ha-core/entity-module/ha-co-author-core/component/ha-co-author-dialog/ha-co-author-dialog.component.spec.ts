import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCoAuthorDialogComponent } from './ha-co-author-dialog.component';

describe('HaCoAuthorDialogComponent', () => {
  let component: HaCoAuthorDialogComponent;
  let fixture: ComponentFixture<HaCoAuthorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaCoAuthorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCoAuthorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
