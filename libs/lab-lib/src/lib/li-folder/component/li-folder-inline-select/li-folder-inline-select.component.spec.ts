import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFolderInlineSelectComponent } from './li-folder-inline-select.component';

describe('LiFolderInlineSelectComponent', () => {
  let component: LiFolderInlineSelectComponent;
  let fixture: ComponentFixture<LiFolderInlineSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiFolderInlineSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiFolderInlineSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
