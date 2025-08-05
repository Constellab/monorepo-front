import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFolderSelectComponent } from './li-folder-select.component';

describe('LiFolderSelectComponent', () => {
  let component: LiFolderSelectComponent;
  let fixture: ComponentFixture<LiFolderSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiFolderSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiFolderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
