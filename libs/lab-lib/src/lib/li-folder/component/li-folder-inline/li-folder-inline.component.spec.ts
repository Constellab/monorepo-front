import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFolderInlineComponent } from './li-folder-inline.component';

describe('LiFolderInlineComponent', () => {
  let component: LiFolderInlineComponent;
  let fixture: ComponentFixture<LiFolderInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiFolderInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiFolderInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
