import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaInstantSearchDialogComponent } from './ha-instant-search-dialog.component';

describe('HaInstantSearchDialogComponent', () => {
  let component: HaInstantSearchDialogComponent;
  let fixture: ComponentFixture<HaInstantSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaInstantSearchDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaInstantSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
