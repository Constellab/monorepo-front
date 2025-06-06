import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagTableComponent } from './li-tag-table.component';

describe('LiTagTableComponent', () => {
  let component: LiTagTableComponent;
  let fixture: ComponentFixture<LiTagTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiTagTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
